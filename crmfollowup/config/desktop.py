# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe
from frappe import _

def get_data():
    return [
        {
            "module_name": "CRMFollowup",
            "color": "blue",
            "icon": "octicon octicon-phone",
            "type": "module",
            "label": _("CRM Followup")
        }
    ]