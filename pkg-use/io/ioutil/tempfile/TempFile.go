package main
/**
 GO 创建临时文件示例
 
 go run go_create_tmp_file.go 

 使用 ioutil.TempFile 创建临时文件,Windows 临时目录C:\Users\xxx\AppData\Local\Temp
 TempFile(dir, pattern string) (f *os.File, err error)
 
 TempFile在目录里创建一个临时文件,
*/
import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main(){
	
	tmpFile,err := ioutil.TempFile("","file-name-pre")
	if err != nil {
		fmt.Print(err)
	}

	filename := tmpFile.Name()
	fmt.Printf("临时文件名称:%s\n",filename)
	
	//前后缀的文件
	tmpFile,err = ioutil.TempFile("d:/tmp","myfile-*-ABC.tmp")
	if err != nil {
		fmt.Print(err)
	}

	filename = tmpFile.Name()
	fmt.Printf("临时文件名称:%s\n",filename)


	
	p,s := prefixAndSuffix("test-file")
	fmt.Printf("字符串匹配prefix:%s,suffix:%s\n",p,s)
	p,s = prefixAndSuffix("test*file")
	fmt.Printf("字符串匹配prefix:%s,suffix:%s\n",p,s)
}

//
// 获取pattern前缀和后缀,如果pattern中包含"*"
// 例如 file*end 那么 prefix = "file",suffix = "end"
//      test-123 那么 prefx = "test-123", suffix= ""
//
func prefixAndSuffix(pattern string)(prefix string,suffix string){
	
	if pos := strings.LastIndex(pattern,"*"); pos != -1{
		prefix,suffix = pattern[:pos], pattern[pos+1:]
	}else{
		prefix = pattern
	}
	return
}



