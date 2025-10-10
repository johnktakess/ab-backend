import { Request, Response } from "express";
import { Country } from "../models/masterCountries";


export const createCountry = async (req: Request, res: Response) => {
  try {

    const { countryName, countryCode } = req.body;

    if (!countryName || !countryCode) {
      return res.status(400).json({
        success: false,
        message: "countryName and countryCode are required",
      });
    }

    const existing = await Country.findOne({ countryCode });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Country with this code already exists",
      });
    }

    const newCountry = new Country({ countryName, countryCode });
    await newCountry.save();

    res.status(201).json({ success: true, data: newCountry });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating country",
      error,
    });
  }
};

export const getAllCountries = async (_req: Request, res: Response) => {
  try {
    const countries = await Country.find().sort({ countryName: 1 });
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching countries",
      error,
    });
  }
};

export const getCountryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const country = await Country.findById(id);

    if (!country)
      return res
        .status(404)
        .json({ success: false, message: "Country not found" });

    res.status(200).json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching country",
      error,
    });
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { countryName, countryCode } = req.body;

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { countryName, countryCode },
      { new: true, runValidators: true }
    );

    if (!updatedCountry)
      return res
        .status(404)
        .json({ success: false, message: "Country not found" });

    res.status(200).json({ success: true, data: updatedCountry });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating country",
      error,
    });
  }
};


export const deleteCountry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndDelete(id);

    if (!country)
      return res
        .status(404)
        .json({ success: false, message: "Country not found" });

    res
      .status(200)
      .json({ success: true, message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting country",
      error,
    });
  }
};
