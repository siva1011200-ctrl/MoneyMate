from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import time
import os

from .config import CORS_ORIGINS
from .routers import (
    users,
    expenses,
    income,
    budgets,
    savings,
    dashboard
)

from .utils import init_db


# Initialize Database
init_db()


app = FastAPI(
    title="MoneyMate API",
    description="Personal Finance Management System",
    version="1.0.0"
)


# -------------------------
# CORS Configuration
# -------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=CORS_ORIGINS,

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH"
    ],

    allow_headers=[
        "Authorization",
        "Content-Type"
    ],
)



# -------------------------
# Request Logging Middleware
# -------------------------

@app.middleware("http")
async def request_logger(
    request: Request,
    call_next
):

    start_time=time.time()


    response = await call_next(request)


    process_time = (
        time.time()
        -
        start_time
    )


    print(
        f"{request.method} "
        f"{request.url.path} "
        f"{process_time:.4f}s"
    )


    return response



# -------------------------
# Global Error Handler
# -------------------------

@app.exception_handler(Exception)
async def global_exception_handler(
    request:Request,
    exc:Exception
):

    return JSONResponse(

        status_code=500,

        content={

            "success":False,

            "message":
            "Internal Server Error"

        }

    )



# -------------------------
# Routers
# -------------------------

app.include_router(
    users.router
)


app.include_router(
    expenses.router
)


app.include_router(
    income.router
)


app.include_router(
    budgets.router
)

app.include_router(
    budgets.router_legacy
)


app.include_router(
    savings.router
)

app.include_router(
    savings.router_legacy
)


app.include_router(
    dashboard.router
)



# -------------------------
# Health Check
# -------------------------

@app.get("/")
def home():

    return {

        "status":"running",

        "application":
        "MoneyMate Backend",

        "version":
        "1.0.0"

    }



@app.get("/health")
def health():
    return {
        "status": "healthy",
        "port": int(os.getenv("PORT", 8000))
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)