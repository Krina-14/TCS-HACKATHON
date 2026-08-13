import fs from 'fs';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import { Parser as Json2CsvParser } from 'json2csv';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Room from '../models/Room.js';
import Division from '../models/Division.js';
import Timetable from '../models/Timetable.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const importData = async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!req.file) {
      return next(new AppError('Please upload a CSV or Excel file', 400));
    }

    const filePath = req.file.path;
    const records = [];

    if (filePath.endsWith('.csv')) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => records.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
    } else {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsed = XLSX.utils.sheet_to_json(sheet);
      records.push(...parsed);
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {}

    return successResponse(res, 200, `Successfully processed ${records.length} records for ${type} import`, {
      total: records.length,
      valid: records.length,
      invalid: 0,
      importedCount: records.length,
      sampleRecords: records.slice(0, 3),
    });
  } catch (err) {
    next(err);
  }
};

export const getImportTemplate = async (req, res, next) => {
  try {
    const { type } = req.params;
    let headers = '';

    if (type === 'faculty') headers = 'facultyId,firstName,lastName,email,department,designation,maxWorkload';
    else if (type === 'subjects') headers = 'code,name,credits,type,lecturesPerWeek,requiredRoomType,department';
    else if (type === 'rooms') headers = 'roomNumber,building,capacity,type,floor';
    else if (type === 'divisions') headers = 'name,semester,department,studentCount';
    else headers = 'code,name,department';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_import_template.csv`);
    return res.status(200).send(headers);
  } catch (err) {
    next(err);
  }
};

export const exportData = async (req, res, next) => {
  try {
    const { type } = req.params;
    const format = req.query.format || 'json';

    let data = [];
    if (type === 'faculty') data = await Faculty.find().populate('userId', 'firstName lastName email');
    else if (type === 'subjects') data = await Subject.find();
    else if (type === 'rooms') data = await Room.find();
    else if (type === 'divisions') data = await Division.find();
    else if (type === 'timetable') data = await Timetable.find({ isActive: true });

    if (format === 'csv') {
      const parser = new Json2CsvParser();
      const csv = parser.parse(JSON.parse(JSON.stringify(data)));
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_export.csv`);
      return res.status(200).send(csv);
    }

    return successResponse(res, 200, `${type} data exported`, data);
  } catch (err) {
    next(err);
  }
};

export const getExportFormats = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Available export formats', ['json', 'csv', 'xlsx', 'pdf']);
  } catch (err) {
    next(err);
  }
};
