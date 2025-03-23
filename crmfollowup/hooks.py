# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "crmfollowup"
app_title = "CRM Followup"
app_publisher = "Naresh Khatri"
app_description = "Enhanced CRM followup with call logging and WhatsApp integration"
app_icon = "octicon octicon-file-directory"
app_color = "blue"
app_email = "info@example.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/crmfollowup/css/crmfollowup.css"
app_include_js = "/assets/crmfollowup/js/crmfollowup.js"

# include js, css files in header of web template
# web_include_css = "/assets/crmfollowup/css/crmfollowup.css"
# web_include_js = "/assets/crmfollowup/js/crmfollowup.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "crmfollowup/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Lead" : "public/js/lead_custom_buttons.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "crmfollowup.install.before_install"
# after_install = "crmfollowup.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "crmfollowup.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"crmfollowup.tasks.all"
# 	],
# 	"daily": [
# 		"crmfollowup.tasks.daily"
# 	],
# 	"hourly": [
# 		"crmfollowup.tasks.hourly"
# 	],
# 	"weekly": [
# 		"crmfollowup.tasks.weekly"
# 	]
# 	"monthly": [
# 		"crmfollowup.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "crmfollowup.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "crmfollowup.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "crmfollowup.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]