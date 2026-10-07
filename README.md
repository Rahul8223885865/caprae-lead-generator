# B2B Lead Generator

A smart B2B lead generation and prioritization tool designed to help sales teams discover, filter, qualify, and prioritize potential business leads.

## Overview

The B2B Lead Generator allows users to search for companies using business-focused filters such as:

- Industry
- Location
- Company Size
- Keywords

The system then ranks leads using a rule-based scoring model and presents actionable information such as:

- Lead Score
- Priority
- Decision Maker
- Revenue
- Technology Stack
- Recommended Action
- Company Website
- LinkedIn

Users can also export filtered leads as a CSV file.

## Problem

Sales teams often receive large lists of potential companies but lack a simple way to identify which companies are the most valuable prospects.

The main challenges are:

- Finding relevant companies quickly
- Prioritizing high-potential leads
- Understanding why a lead is relevant
- Reducing manual research
- Exporting qualified leads for further outreach

## Solution

This project provides a centralized lead discovery and qualification workflow.

Users select their target criteria and search for matching companies. Each lead is then evaluated using a transparent scoring system.

The system also provides a recommended next action based on the lead's score.

## Key Features

### Lead Search

Users can filter leads by:

- Industry
- Location
- Company Size
- Keyword

### Lead Scoring

Each lead receives a score from 0 to 100.

Scoring rules:

| Criteria | Points |
|---|---:|
| Industry Match | +30 |
| Location Match | +20 |
| Company Size Match | +20 |
| Keyword Match | +20 |
| Complete Data | +10 |
| **Maximum** | **100** |

### Lead Priority

| Score | Priority |
|---|---|
| 80–100 | High Priority |
| 60–79 | Medium Priority |
| 0–59 | Low Priority |

### Lead Qualification

Each lead includes:

- Company
- Industry
- Location
- Employee Count
- Revenue
- Decision Maker
- Website
- LinkedIn
- Technologies

### Recommended Action

The application converts the lead score into a simple sales action.

Examples:

- High-priority lead → Contact decision maker within 24 hours
- Medium-priority lead → Research further and contact decision maker
- Low-priority lead → Keep in low-priority prospect list

### Dashboard

The dashboard provides an overview of:

- Total Leads
- High Priority Leads
- Medium Priority Leads
- Low Priority Leads

### Sorting

Leads can be sorted by:

- Highest Score
- Lowest Score
- Company Name A–Z

### CSV Export

Users can export the current filtered results as:

`caprae-leads.csv`

The CSV contains:

- Company
- Industry
- Location
- Employees
- Revenue
- Website
- LinkedIn
- Decision Maker
- Technologies
- Lead Score
- Priority

## Tech Stack

### Frontend

- React
- TypeScript
- Material UI
- Vite

### Backend

- Node.js
- Express.js
- CORS

### Data

The current prototype uses structured seed data through the backend.

The architecture is intentionally designed so that the seed data can later be replaced by database records or external lead providers.

## Architecture

```text
                 User
                   |
                   v
        React + TypeScript + MUI
                   |
                   | HTTP REST API
                   v
            Express.js Backend
                   |
                   v
            Lead Data Layer
                   |
          -------------------
          |        |        |
       Filters   Scoring   Enrichment