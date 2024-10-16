import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, getMyGroups, newGroupChat } from "../controllers/chat.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new",newGroupChat)
app.get("/my",getMyChats)
app.get("/my/group",getMyGroups)

export default app;
