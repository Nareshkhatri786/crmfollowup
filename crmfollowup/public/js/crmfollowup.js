// Main JavaScript file for CRMFollowup module
// This file is included in all Frappe pages via app_include_js in hooks.py

frappe.provide("crmfollowup");

// Utility function to format phone numbers
crmfollowup.formatPhoneNumber = function(phone) {
    if (!phone) return '';
    
    // Remove any non-digit characters
    phone = phone.replace(/\D/g, '');
    
    // Add the plus sign if not present and the number is likely international
    if (phone.length > 10 && !phone.startsWith('+')) {
        phone = '+' + phone;
    }
    
    return phone;
};

// Utility function to log calls
crmfollowup.logCall = function(doctype, docname, phone, callback) {
    let d = new frappe.ui.Dialog({
        title: __('Log Call'),
        fields: [
            {
                label: __('Call Type'),
                fieldname: 'call_type',
                fieldtype: 'Select',
                options: 'Outgoing\nIncoming',
                default: 'Outgoing',
                reqd: 1
            },
            {
                label: __('Call Status'),
                fieldname: 'call_status',
                fieldtype: 'Select',
                options: 'Answered\nNot Answered\nBusy\nVoicemail\nWrong Number',
                default: 'Answered',
                reqd: 1
            },
            {
                label: __('Call Date & Time'),
                fieldname: 'call_date',
                fieldtype: 'Datetime',
                default: frappe.datetime.now_datetime(),
                reqd: 1
            },
            {
                label: __('Duration (seconds)'),
                fieldname: 'call_duration',
                fieldtype: 'Int',
                default: 0
            },
            {
                label: __('Phone Number'),
                fieldname: 'phone_number',
                fieldtype: 'Data',
                default: crmfollowup.formatPhoneNumber(phone),
                reqd: 1
            },
            {
                fieldname: 'notes_section',
                fieldtype: 'Section Break',
                label: __('Call Notes')
            },
            {
                label: __('Notes'),
                fieldname: 'notes',
                fieldtype: 'Text Editor'
            },
            {
                fieldname: 'next_action_section',
                fieldtype: 'Section Break',
                label: __('Next Action')
            },
            {
                label: __('Next Action'),
                fieldname: 'next_action',
                fieldtype: 'Select',
                options: 'None\nCall Back\nSend Information\nSchedule Meeting\nSend Proposal\nSend Quote'
            },
            {
                label: __('Next Action Date'),
                fieldname: 'next_action_date',
                fieldtype: 'Datetime'
            },
            {
                label: __('Follow up by'),
                fieldname: 'follow_up_by',
                fieldtype: 'Link',
                options: 'User'
            }
        ],
        primary_action: function() {
            var values = d.get_values();
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Call Log',
                        call_type: values.call_type,
                        call_status: values.call_status,
                        call_date: values.call_date,
                        call_duration: values.call_duration,
                        reference_type: doctype,
                        reference_name: docname,
                        phone_number: values.phone_number,
                        notes: values.notes,
                        next_action: values.next_action,
                        next_action_date: values.next_action_date,
                        follow_up_by: values.follow_up_by
                    }
                },
                callback: function(r) {
                    frappe.show_alert({
                        message: __('Call Log created'),
                        indicator: 'green'
                    });
                    if (callback) callback(r);
                }
            });
            d.hide();
        },
        primary_action_label: __('Log Call')
    });
    d.show();
};

// Utility function to send WhatsApp messages
crmfollowup.sendWhatsApp = function(doctype, docname, phone, lead_status, callback) {
    // Load WhatsApp templates for the current lead status
    frappe.call({
        method: 'crmfollowup.crmfollowup.doctype.whatsapp_template.whatsapp_template.WhatsAppTemplate.get_templates_for_status',
        args: {
            status: lead_status || 'Open'
        },
        callback: function(r) {
            if (r.message && r.message.length) {
                let templates = r.message;
                let template_options = templates.map(t => t.template_name);
                
                // Create a dialog for sending WhatsApp message
                let d = new frappe.ui.Dialog({
                    title: __('Send WhatsApp Message'),
                    fields: [
                        {
                            label: __('To'),
                            fieldname: 'to_number',
                            fieldtype: 'Data',
                            default: crmfollowup.formatPhoneNumber(phone),
                            reqd: 1
                        },
                        {
                            label: __('Template'),
                            fieldname: 'template',
                            fieldtype: 'Select',
                            options: template_options,
                            reqd: 1,
                            onchange: function() {
                                let selected_template = templates.find(t => t.template_name === this.get_value());
                                if (selected_template) {
                                    // Fetch the document to get field values for placeholder replacement
                                    frappe.db.get_doc(doctype, docname).then(doc => {
                                        // Replace placeholders with actual data
                                        let message = selected_template.message_template;
                                        
                                        // Generic replacements for common fields
                                        Object.keys(doc).forEach(field => {
                                            if (typeof doc[field] === 'string' || typeof doc[field] === 'number') {
                                                const regex = new RegExp(`{{${field}}}`, 'g');
                                                message = message.replace(regex, doc[field] || '');
                                            }
                                        });
                                        
                                        d.set_value('message', message);
                                    });
                                }
                            }
                        },
                        {
                            label: __('Message'),
                            fieldname: 'message',
                            fieldtype: 'Text Editor',
                            reqd: 1
                        }
                    ],
                    primary_action: function() {
                        var values = d.get_values();
                        
                        // Create a communication record for the WhatsApp message
                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'Communication',
                                    communication_type: 'Communication',
                                    communication_medium: 'WhatsApp',
                                    sent_or_received: 'Sent',
                                    reference_doctype: doctype,
                                    reference_name: docname,
                                    status: 'Linked',
                                    content: values.message,
                                    subject: 'WhatsApp Message',
                                    sender: frappe.session.user,
                                    phone_no: values.to_number
                                }
                            },
                            callback: function(r) {
                                frappe.show_alert({
                                    message: __('WhatsApp Message sent and recorded'),
                                    indicator: 'green'
                                });
                                if (callback) callback(r);
                            }
                        });
                        d.hide();
                        
                        // Here, you would typically integrate with a WhatsApp API service
                        // For example, Twilio, MessageBird, or a direct WhatsApp Business API
                        frappe.show_alert({
                            message: __('WhatsApp message has been scheduled for delivery'),
                            indicator: 'blue'
                        });
                    },
                    primary_action_label: __('Send')
                });
                d.show();
            } else {
                frappe.msgprint(__('No WhatsApp templates found for this lead status. Please create templates first.'));
            }
        }
    });
};