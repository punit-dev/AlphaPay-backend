require("@dotenvx/dotenvx").config({ path: ".env.test" });
process.env.NODE_ENV = "test";
const request = require("supertest");
const RequestModel = require("../../src/models/user-models/requestModel");
const UserModel = require("../../src/models/user-models/userModel");
const app = require("../../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const NotificationModel = require("../../src/models/user-models/notificationModel");
const CardModel = require("../../src/models/user-models/cardModel");
const TransactionModel = require("../../src/models/user-models/transactionModel");

let mongo;
const testUser = {
  username: "example123",
  fullname: "Example Test",
  password: "123456789",
  email: "domojeb184@ikanteri.com",
  phoneNumber: "9832713485",
  dateOfBirth: "2000-01-01",
  walletBalance: 5000,
};

const payerUser = {
  username: "payer123",
  fullname: "Payer Test",
  password: "123456789",
  email: "payer@ikanteri.com",
  phoneNumber: "9832713486",
  dateOfBirth: "2000-01-01",
  walletBalance: 1000,
};

let authToken;
let payerAuthToken;
let payerId;
let requestId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await UserModel.deleteMany();
  await RequestModel.deleteMany();
  await NotificationModel.deleteMany();
  await TransactionModel.deleteMany();
  await CardModel.deleteMany();

  await UserModel.create(testUser);
  const payerRes = await UserModel.create(payerUser);
  payerId = payerRes._id;

  const res = await request(app).post("/api/v1/users/auth/login").send({
    email: "domojeb184@ikanteri.com",
    password: "123456789",
  });
  authToken = res.body.token;

  const payerLoginRes = await request(app)
    .post("/api/v1/users/auth/login")
    .send({
      email: "payer@ikanteri.com",
      password: "123456789",
    });
  payerAuthToken = payerLoginRes.body.token;

  await request(app)
    .put("/api/v1/users/update-pin")
    .send({ newPin: "123456" })
    .set({ authorization: `Bearer ${authToken}` });

  await request(app)
    .put("/api/v1/users/update-pin")
    .send({ newPin: "123456" })
    .set({ authorization: `Bearer ${payerAuthToken}` });
});

afterAll(async () => {
  await UserModel.deleteMany();
  await RequestModel.deleteMany();
  await NotificationModel.deleteMany();
  await TransactionModel.deleteMany();
  await CardModel.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
});

describe("request route testing", () => {
  it("should create money request successfully", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payerId: payerId,
        amount: 500,
        message: "Please pay me back",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);
    expect(res.body.request.senderId).toBeDefined();
    expect(res.body.request.amount).toBe(500);
    expect(res.body.request.status).toBe("PENDING");
    expect(res.body.request.message).toBe("Please pay me back");
  });

  it("should create money request with default message", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payerId: payerId,
        amount: 300,
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(201);
    expect(res.body.request.message).toMatch(/Request from Example Test/i);
  });

  it("should get all requests for user", async () => {
    await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Test request",
    });

    const res = await request(app)
      .get("/api/v1/users/requests?len=50&reqId=")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.requests).toBeDefined();
    expect(res.body.requests.length).toBeGreaterThan(0);
  });

  it("should get request by ID", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Test request",
    });
    requestId = createdRequest._id;

    const res = await request(app)
      .get(`/api/v1/users/requests?len=50&reqId=${requestId}`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.request._id).toBe(requestId.toString());
    expect(res.body.request.amount).toBe(500);
  });

  it("should accept money request with wallet", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });
    requestId = createdRequest._id;

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${requestId}`)
      .send({
        method: "wallet",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Money request Approved/i);
  });

  it("should accept money request with card", async () => {
    const card = await CardModel.create({
      userId: payerId,
      cardNumber: "1234567890123456",
      cardHolder: "Payer Test",
      expiryDate: "12/30",
      CVV: "123",
      type: "credit",
    });

    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 300,
      message: "Please pay me back",
    });
    requestId = createdRequest._id;

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${requestId}`)
      .send({
        method: "card",
        cardId: card._id,
        pin: "123456",
        message: "Paid via card",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Money request Approved/i);
  });

  it("should deny money request", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });
    requestId = createdRequest._id;

    const res = await request(app)
      .put(`/api/v1/users/requests/denied?reqId=${requestId}`)
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Money request successfully denied/i);
    expect(res.body.request.status).toBe("DENIED");
  });

  it("should delete money request", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });
    requestId = createdRequest._id;

    const res = await request(app)
      .delete(`/api/v1/users/requests/delete?reqId=${requestId}`)
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Request successfully deleted/i);
  });
});

describe("request route edge cases", () => {
  it("should fail create request without payerId", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        amount: 500,
        message: "Please pay me back",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Payer is required/i);
  });

  it("should fail create request without amount", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payer: payerId,
        message: "Please pay me back",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Amount is required/i);
  });

  it("should fail create request with invalid amount", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payerId: payerId,
        amount: -100,
        message: "Please pay me back",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Amount must be greater than 0/i);
  });

  it("should fail create request with invalid message", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payerId: payerId,
        amount: 500,
        message: 123,
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Enter valid message content/i);
  });

  it("should fail create request with non-existent payer", async () => {
    const res = await request(app)
      .post("/api/v1/users/requests/create")
      .send({
        payerId: "6123456789abcdef01234567",
        amount: 500,
        message: "Please pay me back",
      })
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Payer not found/i);
  });

  it("should fail get requests without len parameter", async () => {
    const res = await request(app)
      .get("/api/v1/users/requests?reqId=")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/len must be greater than 0/i);
  });

  it("should fail get requests without reqId parameter", async () => {
    const res = await request(app)
      .get("/api/v1/users/requests?len=50")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/reqId is required/i);
  });

  it("should fail accept request with invalid request ID", async () => {
    const res = await request(app)
      .put("/api/v1/users/requests/accept?reqId=6123456789abcdef01234567")
      .send({
        method: "wallet",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Request not found/i);
  });

  it("should fail accept request without method", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid method/i);
  });

  it("should fail accept request with invalid method", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "invalid",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid method/i);
  });

  it("should fail accept request without pin", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "wallet",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/UPI pin is required/i);
  });

  it("should fail accept request with invalid pin", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "wallet",
        pin: "000000",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Transaction failed/i);
  });

  it("should fail accept request with insufficient wallet balance", async () => {
    const lowBalanceUser = await UserModel.create({
      username: "lowbalance",
      fullname: "Low Balance",
      password: "123456789",
      email: "lowbalance@ikanteri.com",
      phoneNumber: "9832713487",
      dateOfBirth: "2000-01-01",
      walletBalance: 100,
    });

    const lowBalanceRes = await request(app)
      .post("/api/v1/users/auth/login")
      .send({
        email: "lowbalance@ikanteri.com",
        password: "123456789",
      });
    const lowBalanceToken = lowBalanceRes.body.token;

    await request(app)
      .put("/api/v1/users/update-pin")
      .send({ newPin: "123456" })
      .set({ authorization: `Bearer ${lowBalanceToken}` });

    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId: lowBalanceUser._id,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "wallet",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${lowBalanceToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Your wallet balance is too low/i);
  });

  it("should fail accept request with card when card ID is missing", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 500,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "card",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Card ID is required/i);
  });

  it("should fail accept request with invalid card", async () => {
    const createdRequest = await RequestModel.create({
      senderId: (await UserModel.findOne({ username: "example123" }))._id,
      payerId,
      amount: 300,
      message: "Please pay me back",
    });

    const res = await request(app)
      .put(`/api/v1/users/requests/accept?reqId=${createdRequest._id}`)
      .send({
        method: "card",
        cardId: "6123456789abcdef01234567",
        pin: "123456",
        message: "Payment sent",
      })
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Card not found/i);
  });

  it("should fail deny request with invalid request ID", async () => {
    const res = await request(app)
      .put("/api/v1/users/requests/denied?reqId=6123456789abcdef01234567")
      .set({ authorization: `Bearer ${payerAuthToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Request not found/i);
  });

  it("should fail delete request with invalid request ID", async () => {
    const res = await request(app)
      .delete("/api/v1/users/requests/delete?reqId=6123456789abcdef01234567")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Request not found/i);
  });

  it("should return empty request history when no requests exist", async () => {
    const res = await request(app)
      .get("/api/v1/users/requests?len=50&reqId=")
      .set({ authorization: `Bearer ${authToken}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.requests).toBeDefined();
    expect(res.body.requests.length).toBe(0);
  });
});
