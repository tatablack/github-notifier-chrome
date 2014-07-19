(function(){var e={"function":true,object:true},l=e[typeof window]&&window||this,h=e[typeof exports]&&exports&&!exports.nodeType&&exports,k=e[typeof module]&&module&&!module.nodeType&&module,m=k&&k.exports===h&&h,e=e[typeof global]&&global;!e||e.global!==e&&e.window!==e||(l=e);var f=l._,g={overview:function(d){d||(d={});var a="",c=f.escape;with(d)a+='<h3>Overview</h3>\n<div class="alert">You are scheduled to receive notifications when at least one of these conditions is met:\n    <ul>\n        <li>\n            <span class="rule-bullet">@</span><b>'+c(username)+"</b> is mentioned in a commit comment.\n        </li>\n\n        ",authors&&authors.length&&(a+='\n            <li>\n                <span class="rule-bullet icon-users"></span>The commit\'s author is ',1<authors.length&&(a+="one of"),a+=' \n                <ul class="tags">\n                    ',f.each(authors,function(e){a+="\n                        <li><span>"+c(e)+'</span><a href="#" class="delete"></a></li>\n                    '
}),a+="\n                </ul>\n            </li>\n        "),a+="\n    </ul>\n</div>\n";return a},row:function(d){d||(d={});var a="",c=f.escape;with(d)commits.length?(a+='\n    <ul class="highlightable">\n        ',f.forEach(commits,function(e){a+='\n            <li data-commit-id="'+c(e.id)+'">\n                <a href="'+c(e.url)+'">\n                    <div class="commit-thumbnail">\n                        <img src="'+c(e.author.avatarUrl?e.author.avatarUrl+"&s=32":"http://www.gravatar.com/avatar/"+e.author.emailHash+"?d=identicon&s=32")+'">\n                    </div>\n                    <div class="commit-files">\n                        <div class="icon-plus commit-files-added">'+c(e.added.length)+'</div>\n                        <div class="icon-pencil commit-files-modified">'+c(e.modified.length)+'</div>\n                        <div class="icon-minus commit-files-removed">'+c(e.removed.length)+'</div>\n                    </div>\n                    <div class="commit-info">\n                        <div class="commit-message '+c(e.reviewRequired?"commit-review-required":"")+'" title="'+c(e.parsedMessage)+'">'+c(e.parsedMessage)+'</div>\n                        <dl>\n                            <dt>\n                                <ul class="tags">\n                                    <li class="tag-clickable" data-url="'+c(e.repository.url)+'">'+c(e.repository.name)+'</li>\n                                </ul>\n                            </dt>\n                            <dd><span class="commit-author">'+c(e.author.name)+"</span><span> authored this "+c(e.readableTimestamp)+'</span></dd>\n                        </dl>\n                    </div>\n    \n                    \n                    <span class="dismissed icon-remove" title="Dismiss"></span>\n                    <span class="reviewed icon-signup" title="Mark as reviewed"></span>\n                </a>\n            </li>\n        '
}),a+="\n    </ul>\n"):a+='\n    <h2 class="alert">Nothing to see here... yet. Move along.</h2>\n',a+="\n";return a}};typeof define=="function"&&typeof define.amd=="object"&&define.amd? define(["lodash"],function(e){f=e,e.templates=e.extend(e.templates||{},g)}):h&&k?(f=require("lodash"),m?(k.exports=g).templates=g:h.templates=g):f&&(f.templates=f.extend(f.templates||{},g))}).call(this);