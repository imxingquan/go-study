编译项目

1. 下载依赖库
 在src目录下新建golang.org\x
 src> mkdir golang.org\x
 在golang.org\x目录下执行 git clone git clone https://github.com/golang/text.git 下载代码

2. 编译  
src>go install -x golang.org/x/text

3. 运行  
src> go run main.go
