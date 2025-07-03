import './Post.css'

export default function Post({ creator, title, category, description, urgency, status, onDelete, isHome }){
    return (
        <div className='post'>
            <div className='data'>
                <h2 className='title'>
                    {title}
                </h2>
                <div className='creator'>
                    by {creator}
                </div>
                <div className='urgency'>
                    Urgency: {urgency}
                </div>
                <div className='category'>
                    {category}
                </div>
                <div className='description'>
                    {description}
                </div>
            </div>
            <div className='buttons'>
                {!isHome && <button className="delete-button" onClick={onDelete}>Delete</button>}
            </div>
        </div>  
    )
}