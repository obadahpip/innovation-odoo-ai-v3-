from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Flatten DRF error format into a single 'error' key for simple cases
        errors = response.data
        if isinstance(errors, dict):
            # Keep structured errors but also add a top-level 'error' string
            first_error = None
            for key, val in errors.items():
                if isinstance(val, list) and val:
                    first_error = val[0] if isinstance(val[0], str) else str(val[0])
                    break
                elif isinstance(val, str):
                    first_error = val
                    break
            if first_error:
                response.data['error'] = first_error
        elif isinstance(errors, list) and errors:
            response.data = {'error': errors[0], 'detail': errors}

    return response
