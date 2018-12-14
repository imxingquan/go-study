package main
//获取系统的临时目录
// os.TempDir()
import(
	"os"
	"fmt"
)

func main(){
	fmt.Printf("获取系统临时目录[%s]",os.TempDir())
}