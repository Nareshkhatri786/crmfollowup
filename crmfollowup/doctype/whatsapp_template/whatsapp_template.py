# Copyright (c) 2023, Naresh Khatri and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WhatsAppTemplate(Document):
    def validate(self):
        # Validate the template format - ensure no unsafe code
        pass
        
    @staticmethod
    def get_templates_for_status(status):
        """Get templates that match a specific lead status"""
        templates = frappe.get_all("WhatsApp Template", 
            fields=["template_name", "message_template"],
            filters=[["lead_status", "in", [status, "All"]]]
        )
        return templates