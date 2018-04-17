'''
Author : Abhay Gupta
File Name : __init__.py
Functionality : Enables importing of all the files in it's current directory
'''

#Importing all the clustered views dynamically
import os
modules = []
file_list = os.listdir(os.path.dirname(__file__))
for files in file_list:
   mod_name, file_ext = os.path.splitext(os.path.split(files)[-1])
   if file_ext.lower() == '.py':
      if mod_name != '__init__':
         modules.append(files.split(".")[0])

__all__ = modules
