###创建项目 hello 在 first_go/src 目录下  
    $ mkdir -p /first_go/src/hello  

###在hello目录下创建a.go文件，写入以下代码 
    package main  
    import "fmt"  
    func main() {  
      fmt.Printf("hello, world\n")  
    }
###设置GOPATH环境变量到first_go目录,项目的上一级目录
    $ export GOPATH=$HOME/go/work/go-study/first_go  
###编译项目  
    $ go install hello 或者 go build hello [注意使用项目名称，不是代码的名称] 
  生成的程序在first_go/bin目录下
###运行编译好的程序
    $ $GOPATH/bin/hello
