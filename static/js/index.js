performance_started = false;

$(function() {
    updateCommands(true);
    updateAllCommands();
});


$("#next_patch").on("click", function() {
    $.ajax({
        url: "/command/next_patch",
        type: "POST",
        success: function(response) {
            updateCommands();
        }
    });
});


$("#previous_patch").on("click", function() {
    $.ajax({
        url: "/command/previous_patch",
        type: "POST",
        success: function(response) {
            updateCommands();
        }
    });
});

$("#next_patch_file").on("click", function() {
    $.ajax({
        url: "/command/next_patch_file",
        type: "POST",
        success: function(response) {
            updateCommands();
        }
    });
});


$("#previous_patch_file").on("click", function() {
    $.ajax({
        url: "/command/previous_patch_file",
        type: "POST",
        success: function(response) {
            updateCommands();
        }
    });
});



function updateCommands(do_loop = false) {
    $.ajax({
        url: "/get_commands",
        type: "GET",
        success: function(commands) {
            if (Array.isArray(commands) && commands.length > 0) {
                updateUI(commands);
            }
            if (do_loop) {
                setTimeout(updateCommands, 1000, do_loop);
            }
        }
    });
}

function updateAllCommands() {
    $.ajax({
        url: "/get_all_commands",
        type: "GET",
        success: function(commands) {
            updateUI(commands);
        }
    });
}

function updateUI(commands) {
    console.log("started!")
    commands.forEach(function(command) {
        if (command === "performance_started") {
            performance_started = true;
            $("#no_performance").hide();
            $("#performance").show();
        }
        else {
            // command = command.replace("\'\g", "\"");
            let command_parts = command.split("<~separator~>");
            if (command_parts.length === 0) {
            }
            else {
                if (command_parts[0] === "performance_update") {
                    $("#no_performance").hide();
                    $("#performance").show();
                    if (command_parts.length >= 6) {
                        try {
                            let current_patch = command_parts[1];
                            let file_list = JSON.parse(command_parts[2]);
                            let sound_list = JSON.parse(command_parts[3]);
                            let patch_name = command_parts[4];
                            let patch_index = parseInt(command_parts[5]);

                            $("#patch_name").text(patch_name);
                            $("#patch_list").empty();
                            for (let i = 0; i < sound_list.length; i++) {
                                let additional_content = "";
                                if (i === patch_index) {
                                    additional_content = "class='selected'";
                                }
                                $("#patch_list").append(`<li ${additional_content}><button class="list_button" onclick="changePatchIndex(${i})">${sound_list[i].sound}</button></li>`);
                            }
                        }
                        catch (error) {
                            console.error("Error parsing performance update: " + error);
                        }
                    }
                    else {
                        console.warn("Incorrectly Formatted performance output: " + command);
                    }
                }
            }
        }
    });

    if (commands.length > 0) {
        $.ajax({
            url: "/command/clear_output_file",
            type: "POST",
            success: function(result) {

            }
        });
    }

    console.log("Finished!")
}

function changePatchIndex(new_index) {
    $.ajax({
        url: `/command/set_patch_index ${new_index}`,
        type: "POST",
        success: function(result) {
            updateCommands();
        }
    });
}