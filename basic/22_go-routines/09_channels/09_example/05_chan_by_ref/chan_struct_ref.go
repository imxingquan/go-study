
package main

import (
	"fmt"
	"time"
)
//引用类型的通道

type Counter struct{
	count int
}

func (c *Counter)String() string{
	return fmt.Sprintf("{count:%d}",c.count)
}

var mapChan = make(chan map[string]*Counter,1)

func main(){
	syncChan := make(chan struct{},2)

	go func(){
		for {
			if elem,ok := <-mapChan; ok {
				counter := elem["TNT"]
				counter.count++ //这里修改
			}else{
				break
			}
		}
		fmt.Println("Stopped.[receiver]")
		syncChan <- struct{}{}
	}()

	go func(){
		countMap := map[string]*Counter{
			"TNT":&Counter{},
		}
		for i := 0; i < 5; i++ {
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