
// settings
var server;
var report;

server = 'http://data.globalchange.gov';
report = 'nca3draft';

// globals
var current_chapter;
var current_category;
var current_finding;
var current_figure;
var current_table;

// jq.js
$(main);

function load_all_buttons(url, div, label, template) {
    $.getJSON(url,
        function(data) {
            var t = $('<div id="' + div + '"><h3>' + label + '</h3>');
            var html = $("#" + template).html();
            $(data).each(function() { t.append(_.template(html, this)); });
            t.append('</div>');
            $('#main').append(t);
        });
}

function load_chapters(report) {
    load_all_buttons(server + '/report/' + report + '/chapter.json?all=1', 'chapter', 'Chapters', 'chapter_button' );
}

function clear_all() {
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    $('#shown_table').remove();
    $('#findings').remove();
    $('#figures').remove();
    $('#tables').remove();
}

function load_findings(e) {
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'findings';
    $('#category_findings').addClass('active');
    clear_all();
    load_all_buttons(server + '/report/' + report + '/chapter/' + current_chapter + '/finding.json?all=1', 'findings', 'Findings', 'finding_button' );
}

function load_figures(e) {
    console.log('load figures');
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'figures';
    $('#category_figures').addClass('active');
    clear_all();
    load_all_buttons(server + '/report/' + report + '/chapter/' + current_chapter + '/figure.json?all=1', 'figures', 'Figures', 'figure_button' );
}

function load_tables(e) {
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'tables';
    $('#category_tables').addClass('active');
    clear_all();
    load_all_buttons(server + '/report/' + report + '/chapter/' + current_chapter + '/table.json?all=1', 'tables', 'Tables', 'table_button' );
}

function choose_chapter(e) {
    var t = $(e.target);
    if (current_chapter) {
        $('#chapter_' + current_chapter).removeClass('active');
    }
    current_chapter = t.attr('chapter_identifier');
    t.addClass('active');
    $('#chapter_contents_list').remove();
    clear_all();
    if (current_chapter) {
        $.getJSON( server + '/report/' + report + '/chapter/' + current_chapter + '.json' , function(d) {
            $('#main').append(_.template($('#chapter_contents').html(), d ));
        } );
    }
}

function choose_finding (e) {
    var t = $(e.target);
    var identifier = t.attr('finding_identifier');
    if (current_finding) {
        $('#finding_' + current_finding).removeClass('active');
    }
    current_finding = identifier;
    $('#finding_' + identifier).addClass('active');
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    console.log('choose finding ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/finding/' + identifier + '.json',
            function(d) {
                $('#main').append(_.template($('#show_finding').html(),d));
            });
}

function choose_table (e) {
    var t = $(e.target);
    var identifier = t.attr('table_identifier');
    if (current_table) {
        $('#table_' + current_table).removeClass('active');
    }
    current_table = identifier;
    $('#table_' + identifier).addClass('active');
    $('#shown_table').remove();
    $('#shown_figure').remove();
    console.log('choose table ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/table/' + identifier + '.json',
            function(d) {
                $('#main').append(_.template($('#show_table').html(),d));
            });
}

function choose_figure (e) {
    var t = $(e.target);
    var identifier = t.attr('figure_identifier');
    if (current_figure) {
        $('#figure_' + current_figure).removeClass('active');
    }
    current_figure = identifier;
    $('#figure_' + identifier).addClass('active');
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    console.log('choose figure ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/figure/' + identifier + '.json',
            function(d) {
                console.log('got ', d);
                if (!d.images) {
                    d.images = [];
                }
                if (!d.files) {
                    d.files = [];
                }
                $('#main').append(_.template($('#show_figure').html(),d));
                $('.image_identifier').each(
                    function() {
                        var div = $(this);
                        var img = $("<img>");
                        img.attr({class : "img-responsive"});
                        var identifier = div.attr('image_identifier');
                        console.log('getting image ' + identifier);
                        $.getJSON( server + '/image/' + identifier + '.json', function(d) {
                                var f = d.files;
                                console.log('image has file : ',f);
                                img.attr({src : server + f[0].url});
                            });
                        div.html(img);
                    });
            });
}

function set_report(r) {
    $('#report_title').html(r.title);
    $('#report_identifier').html(r.identifier);
}
function set_server(r) {
    var l = $("<a>");
    l.html('<small>powered by gcis on ' + r.replace('http://','') + '</small>');
    l.attr({href : r, target : '_blank' });
    $('#server').html(l);
}

function main() {
    $.getJSON( server + '/report/' + report + '.json', function(d) {
        $('#report_' + report).addClass('active');
        set_report(d);
        set_server(server);
        load_chapters(report);
    });
    $(document).delegate(".chapter_link","click",choose_chapter);
    $(document).delegate(".findings","click",load_findings);
    $(document).delegate(".figures","click",load_figures);
    $(document).delegate(".tables","click",load_tables);
    $(document).delegate(".finding_link","click",choose_finding);
    $(document).delegate(".table_link","click",choose_table);
    $(document).delegate(".figure_link","click",choose_figure);
}


