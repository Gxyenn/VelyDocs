export function success(source: string, endpoint: string, result: any, meta = {}) {
  return Response.json({
    message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
    author: "Gxyenn",
    status: true,
    source,
    endpoint,
    result,
    meta,
  });
}

export function failure(source: string, endpoint: string, messageText: string) {
  return Response.json(
    {
      message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
      author: "Gxyenn",
      status: false,
      source,
      endpoint,
      error: messageText,
    },
    { status: 500 }
  );
}
