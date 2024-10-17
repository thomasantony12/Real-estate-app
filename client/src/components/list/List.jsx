import './list.scss'
import Card from"../card/Card"

function List(props){
  return (
    <div className='list'>
      {props.data.map(item=>(
        <Card key={item.id} item={item}/>
      ))}
    </div>
  )
}

export default List