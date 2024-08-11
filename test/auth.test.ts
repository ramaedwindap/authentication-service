import request from "supertest";
import { app } from "../src/application";
import { prismaClient } from "../src/application/database";
import { AuthService } from "../src/services/auth-service";
import { apiResponse } from "../src/utils/api-response";
import { StatusCodes as status } from "http-status-codes";

describe("Auth API Endpoints", () => {
    beforeAll(async () => {
        await prismaClient.user.deleteMany();
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user with valid data", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "Password123!",
                    password_confirmation: "Password123!",
                    is_active: true,
                    created_at: new Date().toISOString(),
                });
            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("uuid");
        });

        it("should fail registration if email already exists", async () => {
            await request(app).post("/api/auth/register").send({
                username: "duplicateuser",
                email: "testuser@example.com",
                password: "Password123!",
                password_confirmation: "Password123!",
                is_active: true,
                created_at: new Date().toISOString(),
            });

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "duplicateuser2",
                    email: "testuser@example.com",
                    password: "Password123!",
                    password_confirmation: "Password123!",
                    is_active: true,
                    created_at: new Date().toISOString(),
                });

            expect(response.status).toBe(422);
            expect(response.body.errors.email).toBe("Email already been taken");
        });

        it("should fail registration with invalid username format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "invalid username",
                    email: "invaliduser@example.com",
                    password: "Password123!",
                    password_confirmation: "Password123!",
                    is_active: true,
                    created_at: new Date().toISOString(),
                });

            expect(response.status).toBe(422);
            expect(response.body.errors.username).toBe(
                "Username must only contains alphanumeric, dash, and underscore"
            );
        });

        it("should fail registration if passwords do not match", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser2",
                    email: "testuser2@example.com",
                    password: "Password123!",
                    password_confirmation: "Password321!",
                    is_active: true,
                    created_at: new Date().toISOString(),
                });

            expect(response.status).toBe(422);
            expect(response.body.errors.password_confirmation).toBe(
                "Password and Password Confirmation does not match"
            );
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login with valid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password123!",
            });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("accessToken");
            expect(response.body.data).toHaveProperty("refreshToken");
        });

        it("should fail login with invalid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "WrongPassword!",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "These credentials do not match our records"
            );
        });

        it("should fail login with non-existent email", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "nonexistent@example.com",
                password: "Password123!",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "These credentials do not match our records"
            );
        });
    });

    describe("GET /api/auth/get-profile", () => {
        let accessToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "testuser@example.com",
                    password: "Password123!",
                });
            accessToken = loginResponse.body.data.accessToken;
        });

        it("should get profile with valid access token", async () => {
            const response = await request(app)
                .get("/api/auth/get-profile")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("uuid");
            expect(response.body.data).toHaveProperty("username");
        });

        it("should fail to get profile with invalid access token", async () => {
            const response = await request(app)
                .get("/api/auth/get-profile")
                .set("Authorization", `Bearer invalidToken`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(
                "Invalid token. Please login again."
            );
        });

        it("should fail to get profile without access token", async () => {
            const response = await request(app).get("/api/auth/get-profile");

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(
                "Unauthorized. Please login to continue."
            );
        });
    });

    describe("POST /api/auth/refresh-token", () => {
        let refreshToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "testuser@example.com",
                    password: "Password123!",
                });
            refreshToken = loginResponse.body.data.refreshToken;
        });

        it("should refresh access token with valid refresh token", async () => {
            const response = await request(app)
                .post("/api/auth/refresh-token")
                .send({
                    refreshToken,
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("accessToken");
        });

        it("should fail to refresh access token with invalid refresh token", async () => {
            const response = await request(app)
                .post("/api/auth/refresh-token")
                .send({
                    refreshToken: "invalidToken",
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(
                "Invalid token. Please login again."
            );
        });

        it("should fail to refresh access token without refresh token", async () => {
            const response = await request(app)
                .post("/api/auth/refresh-token")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Refresh token is required");
        });
    });

    describe("AuthController Error Handling", () => {
        it("should handle errors in register controller", async () => {
            jest.spyOn(AuthService, "register").mockRejectedValue(
                new Error("Registration failed")
            );

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "erroruser",
                    email: "erroruser@example.com",
                    password: "Password123!",
                    password_confirmation: "Password123!",
                    is_active: true,
                    created_at: new Date().toISOString(),
                });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Registration failed");
        });

        it("should handle errors in login controller", async () => {
            jest.spyOn(AuthService, "login").mockRejectedValue(
                new Error("Login failed")
            );

            const response = await request(app).post("/api/auth/login").send({
                email: "erroruser@example.com",
                password: "Password123!",
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Login failed");
        });
    });
});
