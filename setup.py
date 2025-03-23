from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

# get version from __version__ variable in crmfollowup/__init__.py
from crmfollowup import __version__ as version

setup(
    name="crmfollowup",
    version=version,
    description="Enhanced CRM followup with call logging and WhatsApp integration",
    author="Naresh Khatri",
    author_email="info@example.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)