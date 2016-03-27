# go-study
learning go language

GO 安装
1. 解压安装文件
	tar -C /urs/local -xzf go1.6.linux-amd64.tar.gz
2. 设置环境变量 $HOME/.profile
	export PATH=$PATH:/usr/local/go/bin
安装到自定义位置 /home/imxingquan/go/go
	mkdir ~/go
	tar -C ~/go -xzf go1.6*.tar.gz
	设置GOROOT变量到安装的自定义目录 
	编辑.profile文件，增加如下配置
		export GOROOT=$HOME/go
		export PATH=$PATH:$GOROOT/bin
	保存修改后,执行 source .profile 使配置生效。


参考：https://golang.org/doc/
