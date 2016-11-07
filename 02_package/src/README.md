
set GOPATH=E:\lc\go-study\02_package  

mkdir src/main  
create file main.go  

//build  
$GOPATH> go install main  
//or   
\src\main> go install  

//compile library   
$GOPATH> go build stringutil  
//or working in the pakcage's source directory  
src\stringutil\> go build  

//create reverse_test.go  
$GOPATH> go test stringutil  


git add .
git commit -m "02_package"
git push 