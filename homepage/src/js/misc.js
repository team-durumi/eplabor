

nunjucks.configure('/templates', { autoescape: false });
test = nunjucks.render('_row.njk', {
	'title': "nunjuck test",
	'body': "이상하군 왜 되는거지?"
});