文件批量改名


编译步骤
set GOPATH=D:\usr\home\Go\rename_bat

$GOPATH> go install main

使用说明
main -d 目录名称 -n 新文件名称-%
% 将被替换成递增数字
main -d 目录名称 -n 新文件名称
将在新文件名称末尾增加递增数字