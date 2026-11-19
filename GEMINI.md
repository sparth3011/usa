# Project Rules — Work & Timesheet Logging

Whenever work, features, bug fixes, UI updates, or deployments are completed in this project, **always append a record of the work directly to the Google Sheet** and update the project summary.

## Google Sheet Details
* **Spreadsheet Title:** `usa.chirayusoft`
* **Spreadsheet ID:** `15XCHfBrHc-oA2XwiQ7ak1ds_QQQsB7d5RZzd71FHlrQ`
* **Direct URL:** `https://docs.google.com/spreadsheets/d/15XCHfBrHc-oA2XwiQ7ak1ds_QQQsB7d5RZzd71FHlrQ/edit`

## Recording Instructions
1. **Target Tab:** `'Daily Work Timesheet'`
   * Columns: `Date`, `Day`, `Project Module`, `Active Time Window`, `Time Spent (Hrs)`, `What Work Was Done`, `Status`
   * Method: Append new completed rows using `gsheets mutate append 15XCHfBrHc-oA2XwiQ7ak1ds_QQQsB7d5RZzd71FHlrQ "'Daily Work Timesheet'!A:G" "<values>"`.
2. **Summary Tab:** `'Summary & KPIs'`
   * Keep the Total Logged Hours and Module Breakdown up-to-date with any major new milestone deliverables.
3. **Local Sync:** Also keep `COMMISSION_IQ_Complete_Project_Work_Report.csv` and `COMMISSION_IQ_Complete_Project_Work_Hours_Timesheet_Report.xlsx` synchronized in the project root.
