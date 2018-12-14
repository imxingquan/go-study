// ioutil.WriteFile(filename String,data []byte,perm os.FileMode) error
// 写入文件示例

package main 

import (
	"fmt"
	"io/ioutil"
	"log"
	"reflect"
)

func main(){

	f,err := ioutil.TempFile("d:/tmp","ioutil-wirtefile-*")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	filename := f.Name()

	data := "一次方程也被称为线性方程，因为在笛卡尔坐标系上任何一个一次方程的表示都是一条直线。组成一次方程的每个项必须是常数或者是一个常数和一个变量的乘积。且方程中必须包含一个变量，因为如果没有变量只有常数的式子是代数式而非方程。如果一个一次方程中只包含一个变量（x），那么该方程就是一元一次方程。如果包含两个变量（x和y），那么就是一个二元一次方程，以此类推"

	if err := ioutil.WriteFile(filename,[]byte(data),0644); err != nil {
		log.Fatal("WriteFile %s:%v",filename,err)
	}

	v,_:= ioutil.Discard.Write([]byte(data))
	fmt.Printf("%s,%T\n",reflect.TypeOf(v),v)


}