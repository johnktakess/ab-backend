import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const mongoose = require("mongoose");
import connectDB from './config/db';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import customerRoutes from './routes/customer';
import postRoutes from './routes/posts';
import { auditLogger } from './middleware/auditLogger';
import { apiLimiter } from './middleware/rateLimiter';
import assessmentRoutes from "./routes/assessmentRoutes";
import industryRoutes from "./routes/industryRoutes";
import countryRoutes from "./routes/countryRoutes";
import assessmentTypesRoute from "./routes/assessmentTypeRoutes"
import feedbackMasterRoutes from "./routes/feedbackMasterRoutes";
import employeeMasterFieldRoutes from "./routes/employeeMasterFieldRoutes";
import employeeMasterFieldGroupRoutes from "./routes/employeeMasterFieldGroupRoutes";
import employeeFieldGroupRoutes from "./routes/assessmentEmployeeFieldGroupRoutes";
import employeeFieldRoutes from "./routes/assessmentEmployeeFieldsRoutes";
import staffMembersRoutes from "./routes/staffMemberRoutes"; 

const app = express();
app.use(cors());
app.use(express.json());

app.use(auditLogger);

//Rate Limiting
//app.use(apiLimiter);

//app.use(morgan('dev'));


const PORT = process.env.PORT || 5000;

connectDB()
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection failed', err);
  process.exit(1);
});

/*
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);*/

app.use('/auth', authRoutes);
//app.use('/api', dataRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/assessment_types", assessmentTypesRoute)
app.use("/api/feedback_master", feedbackMasterRoutes);
app.use("/api/employee_master_fields", employeeMasterFieldRoutes);
app.use("/api/employee_master_field_groups", employeeMasterFieldGroupRoutes);
app.use("/api/employee_field_groups", employeeFieldGroupRoutes);
app.use("/api/employee_fields", employeeFieldRoutes);
app.use("/api/staff_member", staffMembersRoutes);

/*app.get("/api/collections", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json(collections.map((col:any) => col.name));
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error });
  }
});*/

app.get('/', (req, res) => res.json({ message: 'OAuth2-style server running (users + clients)' }));


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));