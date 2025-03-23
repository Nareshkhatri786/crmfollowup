# Copyright (c) 2023, Naresh Khatri and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CallLog(Document):
    def validate(self):
        # Create a communication record for this call
        if not frappe.flags.in_import and not frappe.flags.in_test:
            self.create_communication()
            
    def create_communication(self):
        """Create a communication record from the call log"""
        if self.reference_type and self.reference_name:
            communication = frappe.new_doc("Communication")
            communication.communication_type = "Communication"
            communication.communication_medium = "Phone"
            communication.sent_or_received = "Sent" if self.call_type == "Outgoing" else "Received"
            communication.reference_doctype = self.reference_type
            communication.reference_name = self.reference_name
            communication.status = "Linked"
            communication.content = self.notes or f"Call logged: {self.call_type} call ({self.call_status})"
            communication.subject = f"Call: {self.name} - {self.call_status}"
            communication.sender = frappe.session.user
            communication.phone_no = self.phone_number
            communication.insert(ignore_permissions=True)
            
            # Create a ToDo if next action is specified
            if self.next_action and self.next_action != "None" and self.next_action_date:
                todo = frappe.new_doc("ToDo")
                todo.reference_type = self.reference_type
                todo.reference_name = self.reference_name
                todo.description = f"{self.next_action}: {self.reference_name}"
                todo.date = self.next_action_date
                todo.owner = self.follow_up_by or frappe.session.user
                todo.assigned_by = frappe.session.user
                todo.status = "Open"
                todo.insert(ignore_permissions=True)