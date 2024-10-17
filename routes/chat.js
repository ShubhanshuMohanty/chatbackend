import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, getMyChats, getMyGroups, newGroupChat, removeMember } from "../controllers/chat.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new",newGroupChat)
app.get("/my",getMyChats)
app.get("/my/group",getMyGroups)

app.put("/addmembers",addMembers)
app.put("/removemember",removeMember)

export default app;
