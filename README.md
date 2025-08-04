# AV Project Tracker - VCNS Global

A comprehensive project management system for Audio Visual projects with automated reminders, progress tracking, and detailed reporting capabilities.

## Features

- **Project Management**: Create, edit, and track AV projects through 6-stage workflow
- **Automated Reminders**: Email notifications at 7 days, 3 days, and due date
- **Team Management**: Assign AutoCAD designers and project managers
- **Progress Tracking**: Auto-calculated progress based on project status
- **Data Import/Export**: Excel templates for bulk data import
- **Comprehensive Reports**: PDF reports with charts and analytics
- **Apple Glass UI**: Modern glassmorphism design

## Project Stages

1. **Space Planning** (17% complete)
2. **DBR** (33% complete)
3. **BOQ Submission** (50% complete)
4. **Tendering** (67% complete)
5. **Installation** (83% complete)
6. **Complete** (100% complete)

## Usage

1. Visit the live application: [AV Project Tracker](https://yourusername.github.io/av-project-tracker/)
2. Add team members (AutoCAD designers and project managers)
3. Create new projects or import from Excel templates
4. Track project progress and receive automated reminders
5. Generate comprehensive PDF reports

## Email Integration

The system uses EmailJS for automated reminder notifications. Emails are sent to:
- Assigned AutoCAD designer
- Assigned project manager
- Samir@vcnsglobal.com (always included)

## Data Storage

All project data is stored locally in your browser's localStorage, ensuring privacy and offline functionality.

## Technical Details

- Pure HTML/CSS/JavaScript application
- No server required - runs entirely in the browser
- Uses Chart.js for analytics visualization
- EmailJS for automated notifications
- jsPDF for report generation

---

**Developed for VCNS Global**  
🤖 Generated with [Claude Code](https://claude.ai/code)