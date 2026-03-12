"use client";

interface AdBannerProps {
    id: string;      // 例如 'b45c5f74be84f9d9b790c966c91424c4'
    height: number;
    width: number;
    format: string;  // 通常是 'iframe'
}

export default function AdBanner({ id, height, width, format = 'iframe' }: AdBannerProps) {
    const iframeHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; }
            </style>
        </head>
        <body>
            <script type="text/javascript">
                var atOptions = {
                    'key' : '${id}',
                    'format' : '${format}',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="https://drainalmost.com/${id}/invoke.js"></script>
        </body>
        </html>
    `;

    return (
        <div className="flex justify-center items-center my-2 overflow-hidden" style={{ minHeight: height }}>
            <iframe
                srcDoc={iframeHtml}
                width={width}
                height={height}
                frameBorder="0"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
        </div>
    );
}