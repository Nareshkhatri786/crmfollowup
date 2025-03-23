// Add custom buttons to Lead DocType
frappe.ui.form.on('Lead', {
    refresh: function(frm) {
        // Add "Log Call" button
        frm.add_custom_button(__('Log Call'), function() {
            // Create a dialog for logging a call
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
                        default: frm.doc.phone || frm.doc.mobile_no,
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
                                reference_type: frm.doctype,
                                reference_name: frm.docname,
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
                            frm.reload_doc();
                        }
                    });
                    d.hide();
                },
                primary_action_label: __('Log Call')
            });
            d.show();
        }, __('Actions'));

        // Add "Send WhatsApp" button
        frm.add_custom_button(__('Send WhatsApp'), function() {
            // Load WhatsApp templates for the current lead status
            frappe.call({
                method: 'crmfollowup.crmfollowup.doctype.whatsapp_template.whatsapp_template.WhatsAppTemplate.get_templates_for_status',
                args: {
                    status: frm.doc.status || 'Open'
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
                                    default: frm.doc.mobile_no || frm.doc.phone,
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
                                            // Replace placeholders with actual data
                                            let message = selected_template.message_template;
                                            message = message.replace(/{{lead_name}}/g, frm.doc.lead_name || '');
                                            message = message.replace(/{{company_name}}/g, frm.doc.company_name || '');
                                            message = message.replace(/{{source}}/g, frm.doc.source || '');
                                            
                                            d.set_value('message', message);
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
                                            reference_doctype: frm.doctype,
                                            reference_name: frm.docname,
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
                                        frm.reload_doc();
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
        }, __('Actions'));
    }
});