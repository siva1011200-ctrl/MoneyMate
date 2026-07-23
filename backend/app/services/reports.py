from io import BytesIO
from typing import Iterable, List, Any

from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def build_pdf_report(
    title: str,
    headers: List[str],
    rows: Iterable[List[Any]],
) -> bytes:

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
    )

    styles = getSampleStyleSheet()

    elements = [
        Paragraph(title, styles["Title"]),
        Spacer(1, 12),
    ]

    rows_list = list(rows)

    table_data = [headers] + rows_list

    table = Table(
        table_data,
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2563eb"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.whitesmoke,
                        colors.lightgrey,
                    ],
                ),
            ]
        )
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return buffer.read()


def build_excel_report(
    title: str,
    headers: List[str],
    rows: Iterable[List[Any]],
) -> bytes:

    workbook = Workbook()

    sheet = workbook.active

    sheet.title = title[:31] if title else "Report"

    sheet.append(headers)

    for row in rows:
        sheet.append(row)

    buffer = BytesIO()

    workbook.save(buffer)

    buffer.seek(0)

    return buffer.read()