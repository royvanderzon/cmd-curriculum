function imageHandler(image, callback) {
    var data = new FormData();
    data.append('image', image);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/cms/storage/upload_simple', true);
    // xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === 200 && response.success) {
                callback(response.link);
            } else {
                var reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.readAsDataURL(image);
            }
        }
    }
    xhr.send(data);
}

var quill = new Quill('#editor-container', {
    modules: {
        formula: true,
        syntax: true,
        toolbar: '#toolbar-container'
    },
    placeholder: 'Insert an image...',
    theme: 'snow',
    imageHandler: imageHandler
});

var year_data = {}

var components = {
    lastHtml: [],
    countSetback: 0,
    blockRowIterator: vars.blockRowIterator,
    // blockRowIterator: <%= blockRowIterator+1 %>,
    $blockRowColumn: function(id) {
        //create row html
        var html = ''
        html += '<div class="row block-row-container" style="display:none;" id="block_row_container_' + id + '">'
        html += '   <div class="col s10">'
        html += '       <div class="row block-row">'
            //columns will be rendered here
        html += '       </div>'
        html += '   </div>'
            // html += '   <div class="col s2">'
            // html += '       <a class="btn-floating btn-large waves-effect waves-light green add-block-container" id=""><i class="material-icons">add</i></a>'
            // html += '   </div>'
        html += '<div class="col s2 relative">'
        html += '    <div class="action-btn-container">'
        html += '        <div class="fixed-action-btn horizontal relative-action-btn-add-row">'
        html += '            <a class="btn-floating btn-large green waves-effect waves-light green add-block-container"> <i class="large material-icons">add</i> </a>'
        html += '            <ul>'
        html += '                <li><a class="btn-floating red delete_row" data-id="' + id + '"><i class="material-icons">delete</i></a></li>'
        html += '                <li><a class="btn-floating blue move_row move" data-id="' + id + '"><i class="material-icons">open_with</i></a></li>'
        html += '            </ul>'
        html += '        </div>'
        html += '    </div>'
        html += '</div>'
        html += '</div>'
        return html
    },
    blockColumnIterator: vars.blockColumnIterator,
    // blockColumnIterator: <%= blockColumnIterator+1 %>,
    $blockRow: function(id) {
        //create column html
        var html = ''
        html += '<div class="col s12 m3 block-row-column" id="row_container_' + id + '" style="display:none;" data-width="100">'
        html += '    <div class="overview-container">'
        html += '        <ul class="block-container collection with-header" id="block-container_' + id + '">'
            //blocks will be rendered here
        html += '        </ul>'

        html += '        <div class="action-btn-container">'
        html += '        <div class="fixed-action-btn horizontal relative-action-btn">'
        html += '            <a class="btn-floating btn-large blue">'
        html += '                <i class="large material-icons">menu</i>'
        html += '            </a>'
        html += '            <ul>'
        html += '                <li><a class="btn-floating grey edit_flex_sub_column" data-id="' + id + '"><i class="material-icons">settings_overscan</i></a></li>'
        html += '                <li><a class="btn-floating blue move_sub_column move" data-id="' + id + '"><i class="material-icons">open_with</i></a></li>' //data will be saved here
        html += '                <li><a class="btn-floating red delete_column" data-id="' + id + '"><i class="material-icons">delete</i></a></li>' //data will be saved here
        html += '                <li><a class="btn-floating green add_sub_column" data-id="' + id + '"><i class="material-icons">add</i></a></li>' //data will be saved here
        html += '            </ul>'
        html += '        </div>'
        html += '        </div>'

        html += '    </div>'
        html += '</div> '
        return html
    },
    contentBlockIterator: vars.contentBlockIterator,
    // contentBlockIterator: <%= contentBlockIterator+1 %>,
    $contentBlock: function(id) {
        //create block html
        var html = ''
        html += '<li class="collection-item block-content" data-id="' + id + '" id="block_content_' + id + '"><div class="inner-block-content"><span class="data-title-container"><span class="data-title" id="data_title_' + id + '">Edit this</span></span><a data-id="' + id + '" href="#" class="secondary-content edit_block"><i class="material-icons">edit</i></a><a href="#" class="secondary-content move_block"><i class="material-icons">open_with</i></a></div></li>'
        html += '<div class="hide hidden" id="block_html_' + id + '">"[]"</div>'
        html += '<div class="hide hidden" id="block_color_' + id + '"></div>'
        html += '<div class="hide hidden" id="block_image_' + id + '"></div>'
        html += '<div class="hide hidden" id="block_category_' + id + '"></div>'
        return html
    }
}

$(document).ready(function() {

    var currentEditId = 0;

    //add row to bottom
    $('#add-block-row-container').click(function(e) {
        e.preventDefault();
        storeChange()
            //add iterator for id +1
        components.blockRowIterator++
            var html = components.$blockRowColumn(components.blockRowIterator)
                //append html and show slow
        $('.total-overview-container').append(html)
        $('#block_row_container_' + components.blockRowIterator).show('slow', function() {

            $(this).find('.block-row').sortable({
                revert: true,
                handle: ".move_sub_column"
            });

            saveView()
        })
    })

    //add column in row to right
    $('.total-overview-container').on('click', '.add-block-container', function(e) {
        e.preventDefault();
        //add iterator for id +1
        components.blockColumnIterator++
            var html = components.$blockRow(components.blockColumnIterator)
        var $blockRow = $(this).parent().parent().parent().parent().find('.block-row')
            //only add column if not more as 4
        if ($($blockRow).find('.block-row-column').length < 4) {
            storeChange()
            $($blockRow).append(html)
            $('#row_container_' + components.blockColumnIterator).show('slow')
            createBlock(components.blockColumnIterator)
            saveView()
        }
    })

    //delete column from row
    $('.total-overview-container').on('click', '.delete_column', function() {
        storeChange()
        var id = $(this).attr('data-id')
            //first hide column, than remove
        $('#row_container_' + id).hide('slow', function() {
            $(this).remove()
            saveView()
        })
    })

    //delete column from row
    $('.total-overview-container').on('click', '.delete_row', function() {
        storeChange()
        var id = $(this).attr('data-id')
            //first hide column, than remove
        $('#block_row_container_' + id).hide('slow', function() {
            $(this).remove()
            saveView()
        })
    })

    //add row to column in block
    var createBlock = function(id) {
        components.contentBlockIterator++
            var html = components.$contentBlock(components.contentBlockIterator)
        $('#block-container_' + id).append(html)
    }

    //add row in column
    $('.total-overview-container').on('click', '.add_sub_column', function() {
        storeChange()
        var id = $(this).attr('data-id')
        createBlock(id)
        saveView()
    })

    //add row in column
    $('.total-overview-container').on('click', '.edit_flex_sub_column', function() {
        storeChange()
        var columnId = $(this).attr('data-id')
        var rowColumn = $('#row_container_'+ columnId)
        var flexBasis = prompt('What size (%), of 100? (default = 100)')
        $(rowColumn).attr('data-width',flexBasis)
        saveView()
    })

    //fill modal with data
    $('.total-overview-container').on('click', '.edit_block', function(e) {
        e.preventDefault()
        storeChange()
        $('#upload').attr('type', '')
        $('#upload').attr('type', 'file')
        var id = $(this).attr('data-id')
        currentEditId = id
        var blockTitle = $('#block_content_' + id).find('.data-title').html()
            //fill data based on id
        $('.block_title').val(blockTitle)
        console.log($('#block_image_' + id).html())
        if ($('#block_image_' + id).html() == 'undefined' || $('#block_image_' + id).html().length < 1) {
            $('.image-header').css('backgroundImage', 'url(\'/cms/images/noimg.png\')')
        } else {
            // console.log($('#block_image_' + id).html())
            $('.image-header').css('backgroundImage', 'url(\'' + $('#block_image_' + id).html() + '\')')
        }
        $("#color_choise").val($('#block_color_' + currentEditId).html());
        $('#color_choise').material_select();
        // quill.root.innerHTML = $('#block_html_'+id).html()
        quill.setContents(JSON.parse($('#block_html_' + id).html()))

        console.log('/////////////////////////////////////////')
        console.log(($('#block_category_' + currentEditId).html()).split('|'))
        var catsArray = ($('#block_category_' + currentEditId).html()).split('|')
        catsArray.pop()
        if($('#block_category_' + currentEditId).html() == 'undefined'){
            $('#category_choise').val('');
            $('#category_choise').material_select('destroy');
            $('#category_choise').material_select();
        }else{
            console.log('workdssss')
            $('#category_choise').val(catsArray)
            // console.log(JSON.parse(JSON.stringify($('#block_category_' + currentEditId).html())))
            $('#category_choise').material_select('destroy');
            $('#category_choise').material_select();
        }
            // $('.ql-editor').html($('#block_html_'+id).html())
            // quill.container.firstChild.innerHTML = $('#block_html_'+id).html()
            //after load data, open modal
        $('#edit_block').modal('open')
            // saveView()
    })

    //save block
    $('#save_block').click(function(e) {
        e.preventDefault()
        storeChange()
        $('#block_content_' + currentEditId).find('.data-title').html($('.block_title').val())
            // console.log(quill.getContents())
        $('#block_html_' + currentEditId).html(JSON.stringify(quill.getContents()))
            // $('#block_html_'+currentEditId).html(quill.root.innerHTML)
            // $('#block_html_'+currentEditId).html(quill.container.firstChild.innerHTML)
        $('#block_color_' + currentEditId).html($('#color_choise').val())
            //set color type to block
        $('#block_content_' + currentEditId).css('backgroundColor', '#' + $('#color_choise').val())
        var cats = $('#category_choise').val()
        if(cats == null || cats.length < 1){
            var storeCats = 'undefined'
        }else{
            var storeCats = ''
            cats.forEach(function(cat,index){
                storeCats = storeCats + cat + '|'
            })
        }
        $('#block_category_' + currentEditId).html(storeCats)
        saveView()
    })

    //remove_block
    $('#remove_block').click(function(e) {
        e.preventDefault()
        storeChange()

        $('#block_content_' + currentEditId).hide('slow', function() {
            $('#block_content_' + currentEditId).remove()
            saveView()
        })
    })

    var saveFeedback;
    var canSave = true;
    var saveView = function() {

        if (!canSave) {
            return; }
        clearTimeout(saveFeedback);

        $('#save_view').css('opacity', '0.5');
        $('#save_view > i').html('loop');
        $('#save_view > i').addClass('rotate');

        var obj = {
            data: viewToJson(),
            link: '/cms/curriculum/save/'+vars.currentYear,
            // link: '/cms/curriculum/save/<%= currentYear %>',
            cbSucces: function(data) {
                saveFeedback = setTimeout(function() {
                    $('#save_view').css('opacity', '1');
                    $('#save_view > i').html('save');
                    $('#save_view').removeClass('red');
                    $('#save_view').addClass('green');
                    $('#save_view > i').removeClass('rotate');
                    canSave = true;
                    // Materialize.toast("Saved!", 1000, "green");
                }, 500)
            },
            cbFailure: function(data) {
                console.log(data)
                $('#save_view > i').html('close');
                $('#save_view').removeClass('green');
                $('#save_view').addClass('red');
                $('#save_view').css('opacity', '1');
                $('#save_view > i').removeClass('rotate');
                canSave = true;
                Materialize.toast("Cannot save, connection with server lost. Please try to refresh!", 3000, "red");
            }
        }
        zoncms.ajax.sendData2(obj);
    }

    var setBack = function() {
        if (components.countSetback < 4) {
            components.countSetback++
                console.log('///////////////////////')
            console.log(components.countSetback)
            console.log(components.lastHtml)
            $('.total-overview-container').html(components.lastHtml[components.lastHtml.length - components.countSetback])
            saveView()
            makeSortable()
            Materialize.toast("Step back <em>(" + components.countSetback + "/4)</em>.", 3000, "blue");
        } else {
            Materialize.toast("Can't go back more.", 3000, "orange");
        }
    }

    var storeChange = function() {
        components.countSetback = 0
        components.lastHtml.push($('.total-overview-container').html())
        if (components.lastHtml.length > 4) {
            components.lastHtml.splice(0, 1)
        }
    }

    //save view with AJAX request
    $('#save_view').click(function(e) {
        saveView()
        canSave = false
    })

    //init modal
    $('.modal').modal();
    //init select
    $('#color_choise').material_select();
    $('#category_choise').material_select();

    function KeyPress(e) {
        var evtobj = window.event ? event : e
        console.log(evtobj.keyCode)
        if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
            setForward()
        }
        if (evtobj.keyCode == 90 && evtobj.ctrlKey || evtobj.keyCode == 91 && evtobj.cmdKey) {
            setBack()
        };
    }
    document.onkeydown = KeyPress;
    $(window).keydown(function(e) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            if (e.metaKey == true && e.keyCode == 89) {
                setForward()
            }
            if (e.metaKey == true && e.keyCode == 90) {
                setBack()
            }
        }
    })


    $("#formContent").submit(function(e) {
        e.preventDefault();

        var formdata = new FormData(this);

        $.ajax({
            url: "/cms/storage/upload_simple",
            type: "POST",
            data: formdata,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                var response = JSON.parse(data)
                $('#block_image_' + currentEditId).html(response.link)
            },
            error: function() {
                console.log('something went wrong uploading...')
            }
        });
    });

    $("#upload").change(function() {
        console.log('uploaddinggg')
        $('#formContent').submit()
            // return false;
    });

    var makeSortable = function() {
        $(".total-overview-container").sortable({
            revert: true,
            cursor: 'move',
            handle: ".move_row",
            stop: function() {
                saveView()
            }
        });

        $(".block-row").sortable({
            revert: true,
            cursor: 'move',
            handle: ".move_sub_column",
            stop: function() {
                saveView()
            }
        });

        $(".block-container").sortable({
            revert: true,
            cursor: 'move',
            handle: ".move_block",
            stop: function() {
                saveView()
            }
        });
    }

    makeSortable()

    // $(".edit_flex_sub_column").click(function(){
    //     console.log($(this))
    // })

    // $( ".draggable" ).draggable({
    //   connectToSortable: "#sortable",
    //   helper: "clone",
    //   revert: "invalid"
    // });
    // $( "ul, li" ).disableSelection();

})


//save all data from html DOM to JSON
var viewToJson = function() {
    var json = {
        rows: []
    }
    $rows = $('.total-overview-container > .block-row-container')
    $($rows).each(function(index, elRow) {
        var row = []
        $(elRow).find('.block-row-column').each(function(index, elColumn) {
            var column = {
                flexBasis: $(this).attr('data-width'),
                column: []
            }
            $(elColumn).find('.block-content').each(function(index, elBlock) {
                var block = {}
                var block_id = $(elBlock).attr('data-id')
                block.id = block_id
                block.title = $('#data_title_' + block_id).html()
                block.content = $('#block_html_' + block_id).html()
                block.color = $('#block_color_' + block_id).html()
                block.image = $('#block_image_' + block_id).html()
                block.category = $('#block_category_' + block_id).html()
                column.column.push(block)
            })
            row.push(column)
        })
        json.rows.push(row)
    })
    return json
}
