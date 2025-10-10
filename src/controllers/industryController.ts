
import { Request, Response } from "express";
import { Industry } from "../models/masterIndustries";

 const generateIndustryTypeCode = (name: string): string => {
  const prefix = name.split(" ")[0].substring(0, 5).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}_${randomSuffix}`;
};

export const createIndustry = async (req: Request, res: Response) => {
  try {
    const { industryName } = req.body; 
    const industryType = generateIndustryTypeCode(industryName);

    const newIndustry = new Industry({ industryName, industryType });
    await newIndustry.save();

    res.status(201).json({ success: true, data: newIndustry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating industry", error });
  }
};

export const getAllIndustries = async (_req: Request, res: Response) => {
  try {
    const industries = await Industry.find();
    res.status(200).json({ success: true, data: industries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching industries", error });
  }
};

export const getIndustryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const industry = await Industry.findById(id);

    if (!industry)
      return res.status(404).json({ success: false, message: "Industry not found" });

    res.status(200).json({ success: true, data: industry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching industry", error });
  }
};

export const updateIndustry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { industryName } = req.body;

    const updatedData: any = { industryName };
    if (industryName) updatedData.industryType = generateIndustryTypeCode(industryName);

    const industry = await Industry.findByIdAndUpdate(id, updatedData, { new: true });

    if (!industry)
      return res.status(404).json({ success: false, message: "Industry not found" });

    res.status(200).json({ success: true, data: industry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating industry", error });
  }
};

export const deleteIndustry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const industry = await Industry.findByIdAndDelete(id);

    if (!industry)
      return res.status(404).json({ success: false, message: "Industry not found" });

    res.status(200).json({ success: true, message: "Industry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting industry", error });
  }
};

