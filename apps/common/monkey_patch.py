import django.template.context
import copy

# Patch for Python 3.14 compatibility with Django 4.2
# Fixes AttributeError: 'super' object has no attribute '__dict__'

def context_copy(self):
    # Create a new instance without calling __init__
    duplicate = self.__class__.__new__(self.__class__)
    
    # Copy the instance dictionary
    duplicate.__dict__ = self.__dict__.copy()
    
    # Specifically copy the 'dicts' attribute used by Django Contexts
    if hasattr(self, 'dicts'):
        duplicate.dicts = self.dicts[:]
        
    return duplicate

# Apply patch
django.template.context.Context.__copy__ = context_copy
django.template.context.RequestContext.__copy__ = context_copy
