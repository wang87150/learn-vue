let a = "color: red;font-size: 12px;";

a.replace(/([^:;]\s*+)\:\s*([^:;]\s*+)/g, function() {
    console.log(arguments);
})