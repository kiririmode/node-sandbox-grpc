const path = require("path")
const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

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
        "localhost:50050",
        grpc.credentials.createInsecure(),
        {
            "grpc.keepalive_time_ms": 1000,
            "grpc.keepalive_timeout_ms": 2000,
            //            "grpc.keepalive_permit_without_calls": 1,
            "grpc.http2.min_time_between_pings_ms": 3000,
            "grpc.http2.max_pings_without_data": 0
        }
    )
    const call = client.SayHellos({ name: "kiririmode" })
    call.on("data", data => {
        console.log("data: " + JSON.stringify(data))
    })
    call.on("end", () => {
        console.log("end")
    })
    call.on("error", e => {
        console.log(e)
    })
    call.on("status", status => {
        console.log("status: " + JSON.stringify(status))
    })
} catch (ex) {
    console.error(ex)
}
