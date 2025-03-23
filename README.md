# CRM Followup

Enhanced CRM followup module for Frappe/ERPNext with call logging and WhatsApp integration.

## Features

- **Call Logging**: Add call logs directly from the Lead interface with detailed information
- **WhatsApp Integration**: Send WhatsApp messages using predefined templates based on lead status
- **Follow-up Management**: Create follow-up tasks and schedule next actions
- **Communication History**: All interactions are logged in the standard Frappe Communication DocType
- **Custom Templates**: Create and manage WhatsApp message templates for different lead statuses

## Requirements

- Frappe v13+
- For WhatsApp integration, you need a WhatsApp Business API account or a third-party integration service

## Installation

### From the bench

```bash
cd frappe-bench
bench get-app https://github.com/yourusername/crmfollowup.git
bench install-app crmfollowup
```

### Manual Installation

Download this repository as a ZIP file and extract it in your `frappe-bench/apps` directory. Then run:

```bash
bench install-app crmfollowup
```

## Configuration

1. After installation, you'll have access to two new DocTypes:
   - Call Log
   - WhatsApp Template

2. Create WhatsApp Templates for different lead statuses to use with the WhatsApp integration.

3. The Lead form will have two new buttons in the Actions menu:
   - Log Call
   - Send WhatsApp

## License

MIT