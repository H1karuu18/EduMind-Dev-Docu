Figma Mid-Fidelity Wireframe Prompt
General Instructions
Create a set of mid-fidelity wireframes for EduMind — a Smart-Assisted Knowledge Management System for the School of Computing and Information Technologies (SOCIT) at Asia Pacific College. Use grayscale fills, placeholder text, and simple component blocks. No color, branding, or icons — only layout, hierarchy, and functional structure. All screens should reflect the three user roles: Faculty Member, Executive Director, and System Administrator. Apply a clean, minimal academic web application aesthetic similar to modern LMS platforms.

Screen 1 — Login Page
Create a centered login card on a light gray background. Include a top logo placeholder block labeled "EduMind", a headline "Welcome Back", a subheadline "Smart-Assisted Knowledge Management System — SOCIT, APC", two input fields labeled "Institutional Email" and "Password", a primary button labeled "Log In", and a small text link "Forgot password?". Below the card add a small label "Role is automatically assigned upon login via RBAC."

Screen 2 — Faculty Dashboard (Home)
Create a two-column layout. Left side: a vertical sidebar navigation with items labeled Dashboard, My Syllabi, Activity Bank, AI Subject Sessions, Search, Collaboration Space, and Notifications. Right side: a top greeting bar "Good morning, [Faculty Name]", then a row of three summary cards labeled "Pending Peer Reviews", "Upcoming Syllabus Deadlines", and "New Recommendations". Below the cards: a section labeled "My Subjects This Term" showing a grid of subject cards, each containing a subject code, subject name, term label, and two buttons labeled "Open Session" and "View Syllabus". At the bottom: a section labeled "Recent Activity" showing a simple list of timestamped actions.

Screen 3 — Syllabus Submission and Workflow
Create a full-page form layout. At the top: a breadcrumb "My Syllabi > Submit New Syllabus". Below: a two-column form with fields for Subject, Section, Term, and Academic Year on the left, and a large drag-and-drop upload area on the right labeled "Upload Syllabus (PDF, DOCX, PPTX only)". Below the upload area: an auto-populated section labeled "Extracted Metadata Preview" showing placeholder tags for Subject, Department, Document Type, and Term — labeled as auto-generated. At the bottom: a workflow status bar showing four steps labeled "Draft", "Submitted for Peer Review", "Pending ED Approval", and "Approved", with the first step highlighted. Include a primary button "Submit for Peer Review" and a secondary button "Save as Draft".

Screen 4 — Peer Review Screen (Faculty — Same Subject)
Create a split-screen layout. Left side: a document preview panel labeled "Syllabus Preview — [Subject Name] v1.0" with a placeholder document block and a version dropdown. Right side: a review panel with a section labeled "Review from [Co-Faculty Name]" showing a comment box, a status tag labeled "Pending Your Review", and two action buttons labeled "Approve" and "Request Revision". Below the action buttons: a text input labeled "Add Comment (optional)" and a submit button. At the top of the right panel: a notification banner "You and 1 other faculty member handle this subject. Both approvals are required before ED review."

Screen 5 — Executive Director Dashboard
Same sidebar structure as the Faculty Dashboard but with navigation items: Dashboard, Pending Approvals, Revision Audit Trail, Repository Overview, and Notifications. Right side: a top bar showing "Pending Approvals (X)" as a prominent badge. Below: a table-style list of pending syllabi showing columns for Subject, Faculty Name, Version, Date Submitted, Peer Review Status, and an Actions column with buttons labeled "Review", "Approve", and "Reject". At the top of the page add a toggle labeled "Viewing as: Executive Director | Switch to Faculty View" — grayed out unless the ED is flagged as teaching.

Screen 6 — Syllabus Approval Screen (Executive Director)
Same split-screen layout as Screen 4. Left: document preview with version history dropdown. Right: an approval panel showing "Peer Review Status: Approved by all co-faculty", a section for ED comments, and two large action buttons — "Approve and Lock Version" (primary) and "Return for Revision" (secondary). Below: a version history timeline showing v1.0 Submitted, v1.1 Revised, with timestamps and actor labels. Add a label at the top "This action is final. Approved versions are locked and logged."

Screen 7 — AI Subject Session
Create a two-panel layout. Left panel: a session info sidebar showing the subject name, term, section, and a list of uploaded materials as file items with labels and a remove button. At the bottom of the sidebar: an upload button labeled "Add Materials to Session". Right panel: a chat interface with a top label "EduMind AI — [Subject Name] Session", a message history area showing example exchanges between the user and the AI (use placeholder lorem text), and at the bottom a text input bar labeled "Ask a question about your course materials..." with a send button. Below the input bar add a disclaimer label "Responses are generated from uploaded session materials only. No external sources are used."

Screen 8 — Activity Bank
Create a searchable grid layout. At the top: a search bar labeled "Search activities, quizzes, or materials..." with a filter row showing dropdowns for Subject, Document Type, Term, and Uploaded By. Below: a masonry or card grid showing activity cards, each containing a document type icon placeholder, a title, subject tag, uploader name, upload date, and two buttons — "Preview" and "Use This". At the top right: a button labeled "Contribute to Activity Bank". At the bottom of the page add a note "Activities are shared within SOCIT only."

Screen 9 — System Administrator Panel
Create a clean admin dashboard layout. Left sidebar: navigation items labeled Dashboard, Manage Accounts, RBAC & Roles, Departments & Subjects, Term Settings, Audit Logs, and System Health. Right side: a top summary row with four stat cards labeled "Total Accounts", "Active Faculty", "Active Executive Directors", and "Pending Account Requests". Below: an accounts table with columns for Name, Role, Department, Status, Teaching Flag, and Actions. The Teaching Flag column should show a toggle switch — on or off — per ED account. Actions column: "Edit", "Deactivate", "Reset Password". At the top right: a button labeled "Create New Account".

Screen 10 — Version History / Audit Trail
Create a timeline layout. At the top: a breadcrumb and subject label. Below: a vertical timeline showing version entries, each containing a version number badge (v1.0, v1.1, v1.2), an actor label (Submitted by / Revised by / Approved by), a timestamp, a short change summary placeholder, and a status tag (Submitted / Revised / Peer Approved / ED Approved / Locked). The latest approved version should be visually distinguished with a "Current Version" tag. At the top right: an "Export Audit Log" button.

Additional Design Notes

Use 8px grid spacing throughout
Sidebar width: approximately 220px
Card border radius: 8px
Use placeholder rectangles for all images and document previews
All buttons should be clearly labeled and sized for 44px minimum tap target
Navigation active state should be indicated with a darker fill on the sidebar item
All screens should have a consistent top header bar showing the EduMind logo placeholder, the current user's name and role, and a notification bell icon