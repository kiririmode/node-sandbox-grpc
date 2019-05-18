const path = require("path")
const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const fs = require("fs")

const PROTO_PATH = path.join(__dirname, "greeter.proto")

try {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
    const greeter = grpc.loadPackageDefinition(packageDefinition).Greeter
    const client = new greeter(
        "kiririmode.com:50050",
        grpc.credentials.createSsl(),
        {
            "grpc.keepalive_time_ms": 1000,
            "grpc.keepalive_timeout_ms": 2000,
            //            "grpc.keepalive_permit_without_calls": 1,
            "grpc.http2.min_time_between_pings_ms": 3000,
            "grpc.http2.max_pings_without_data": 0
        }
    )
    client.SayHello({ name: "kiririmode" }, (err, res) => {
        console.log(res)
    })
} catch (ex) {
    console.error(ex)
}
