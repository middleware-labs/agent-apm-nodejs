const FluentClient = require("@fluent-org/logger").FluentClient;
const logger = new FluentClient("tag_prefix", {
    socket: {
        host: "localhost",
        port: 8006,
        timeout: 3000, // 3 seconds
    }
});

module.exports.log =  (label,msg) => {
    logger.emit(label, {record: msg});
};

