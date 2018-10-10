/*类型推断 混合类型
*/

package main

import "fmt"

func main(){
    var message = "你好"

    var a, b, c = true, 12.3, "im b"

    fmt.Printf("%T %T %T %T",message,a,b,c)
}
// output: string bool float64 string