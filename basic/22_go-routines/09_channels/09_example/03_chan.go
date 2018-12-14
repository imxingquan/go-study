
package main

import (
	"fmt"
	"time"
)
//引用类型的通道

var mapChan = make(chan map[string]int,1)

func main(){
	syncChan := make(chan struct{},2)

	go func(){
		for {
			if elem,ok := <-mapChan;ok{
				elem["TNT"]++ //这里修改
			}else{
				break
			}
		}
		fmt.Println("Stopped.[receiver]")
		syncChan <- struct{}{}
	}()

	go func(){
		countMap := make(map[string]int)
		for i:= 0; i< 5; i++{
			mapChan <- countMap //这里发送
			time.Sleep(time.Millisecond)
			fmt.Printf("The count map: %v [sender]\n",countMap)
		}
		close(mapChan)
		syncChan <- struct{}{}
	}()

	<-syncChan
	<-syncChan
}