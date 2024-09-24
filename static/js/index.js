let performance_started = false;
let files = [];
let current_patch_data = {
    patch_name: "",
    patch_index: 0,
    sound_list: [],
    comments_list: [],

}

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
    commands.forEach(function(command) {
        let command_parts = command.split("<~separator~>");
        if (command_parts.length === 0) {
        }
        else if (command_parts[0] === "performance_started") {
            if (command_parts.length < 2) {
                return;
            }

            try {
                files = JSON.parse(command_parts[1]);
                $("#file_list").empty()
                for (let i = 0; i < files.length; i++) {
                    $("#file_list").append(`<option value="${i}">${files[i]}</option>`)
                }

                performance_started = true;
                $("#no_performance").hide();
                $("#performance").show();
            }
            catch (error) {
                console.error("Error parsing files: " + error);
            }
        }
        else if (command_parts[0] === "performance_ended") {
            performance_started = false;
            $("#no_performance").show();
            $("#performance").hide();
        }
        else if (command_parts[0] === "performance_file_changed") {
            if (command_parts.length < 4) {
                return;
            }
            try {
                current_patch_data["patch_name"] = files[parseInt(command_parts[1])];
                current_patch_data["sound_list"] = JSON.parse(command_parts[2]);
                current_patch_data["comments_list"] = JSON.parse(command_parts[3]);

                updatePatchList();
            }
            catch (error) {
                console.error("Error parsing file update: " + error);
            }
        }
        else if (command_parts[0] === "performance_patch_changed") {
            if (command_parts.length < 2) {
                return;
            }
            try {
                current_patch_data["patch_index"] = parseInt(command_parts[1]);

                changeSelectedPatchIndex();
            }
            catch (error) {
                console.error("Error parsing patch update: " + error);
            }
        }
    });

    // if (commands.length > 0) {
    //     $.ajax({
    //         url: "/command/clear_output_file",
    //         type: "POST",
    //         success: function(result) {
    //
    //         }
    //     });
    // }
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

function updatePatchList() {
    $("#patch_name").text(current_patch_data["patch_name"]);

    let list = $("#patch_list");
    list.empty();

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < current_patch_data["sound_list"].length; i++) {
        let listItem = document.createElement("li");

        if (i === current_patch_data["patch_index"]) {
            listItem.className = 'selected';
        }

        let button = document.createElement("button");
        button.className = "list_button";
        button.textContent = current_patch_data["sound_list"][i];
        button.onclick = function() {
            changePatchIndex(i);
        };

        listItem.appendChild(button);
        fragment.appendChild(listItem);
    }

    list.append(fragment);
}


function changeSelectedPatchIndex() {
    let list = $("#patch_list").children();

    list.each(function(index, element) {
        if (index === current_patch_data["patch_index"]) {
            $(element).addClass("selected");
        } else {
            $(element).removeClass("selected");
        }
    });
}

$("#go_to_file").on("click", function() {
    let index = $("#file_list").find(":selected").val();
    $.ajax({
        url: `/command/set_file_index ${index}`,
        type: "POST",
        success: function(result) {
            updateCommands();
        }
    });
});