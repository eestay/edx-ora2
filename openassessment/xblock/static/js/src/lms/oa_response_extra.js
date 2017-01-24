function temp_tmce() {
    tinymce.init({
    selector: '.submission__answer__part__text__value2',
    auto_focus: 'text-layer',
    height: 500,
    plugins: ['advlist autolink lists link anchor'],
    menubar: false,
    language_url : '/tiny_es.js',
    content_css: '//www.tinymce.com/css/codepen.min.css',
    init_instance_callback: function (editor) {
        var saved_text = tinymce.DOM.getOuterHTML(submission__answer__part__text__1);
        tinymce.activeEditor.setContent( saved_text , {format: 'raw'});
        tinymce.activeEditor.dom.remove('submission__answer__part__text__1', true);
        tinymce.activeEditor.dom.fire('click', console.log('Editor MCE activo'));
        editor.on('focus', function (e) {
            var real_text = tinymce.activeEditor.getContent({format: 'raw'});
                tinymce.DOM.setHTML('submission__answer__part__text__1', real_text);
                });
        editor.on('change', function (e) {
            var real_text = tinymce.activeEditor.getContent({format: 'raw'});
                            tinymce.DOM.setHTML('submission__answer__part__text__1', real_text);
                            });
        editor.on('keyup', function (e) {
            var real_text = tinymce.activeEditor.getContent({format: 'raw'});
                            tinymce.DOM.setHTML('submission__answer__part__text__1', real_text);
                            });
        editor.on('drop', function (e) {
            var real_text = tinymce.activeEditor.getContent({format: 'raw'});
                            tinymce.DOM.setHTML('submission__answer__part__text__1', real_text);
                            });
        editor.on('paste', function (e) {
            var real_text = tinymce.activeEditor.getContent({format: 'raw'});
                            tinymce.DOM.setHTML('submission__answer__part__text__1', real_text);
                            });
                        }
                    });
    }
function temp_tmce_or() {
	tinymce.init({
		height: 500,
		selector: '.submission__answer__part__text__value',
		content_css: '//www.tinymce.com/css/codepen.min.css',
		menubar: false,
		toolbar: false,
		readonly : true,
		init_instance_callback: function (editor) {
            		var saved_text = tinymce.activeEditor.getContent({format: 'text'});
           		tinymce.activeEditor.setContent(saved_text , {format: 'raw'});
			}
		});
}
function temp_css() {
    $("#submission__answer__part__text__1_ifr").css({"visibility":"hidden","min-height":"1px","max-height":"1px"});
    $("#submission__answer__part__text__1").css({"visibility":"hidden","min-height":"1px","max-height":"1px"});
    }
function timer_button() {
    $('#submission__save').removeClass('is--disabled');
    }
setTimeout('temp_tmce()', 5000);
setTimeout('temp_tmce_or()', 5000);
setTimeout('temp_css()', 5000);
setInterval('timer_button()',3000);
setInterval('temp_tmce_or()',2000);
