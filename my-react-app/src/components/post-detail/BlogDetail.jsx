
import './BlogDetail.css';
import Header from '../Header';
import Footer from '../Footer';
import mockPost from '../../mockPost.json';
import mockDnaTesting from '../../dna-testing.json';
import { useParams } from 'react-router-dom';
const BlogDetail = () => {
  const { id, section } = useParams();
  let post;
  if (section === 'post') {

    post = mockPost.find(item => item.id === parseInt(id));
  }
  else if (section === 'dna') {
    post = mockDnaTesting.find(item => item.id === parseInt(id));

  }
  if (!post) {
    return <div>Bài viết không tồn tại.</div>;
  }
  const {
    title,
    date,
    author,
    comments,
    intro,
    featured_image,
    table_of_contents,
    content_sections,
    tags,
    related_posts
  } = post;
  return (
    <div className="blog-detail">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <article className="article">
            <header className="article-header">
              <h1 className="article-title">{title}</h1>
              <div className="article-meta">
                <span>{date}</span>
                <span>•</span>
                <span>{author}</span>
                <span>•</span>
                <span>{comments} Comments</span>
              </div>
            </header>

            <div className="article-content">
              {/* Intro */}
              <div className="intro-text">
                <p dangerouslySetInnerHTML={{ __html: intro }} />
              </div>

              {/* Ảnh chính */}
              <div className="featured-image">
                <img src={featured_image.src} alt={featured_image.alt} className="image" />
                <p className="image-caption">{featured_image.caption}</p>
              </div>

              {/* Mục lục */}
              <div className="table-of-contents">
                <h3 className="toc-title">Nội dung chính</h3>
                <ol className="toc-list">
                  {table_of_contents.map((item, idx) => (
                    <li key={idx} className="toc-item">
                      {item.title}
                      {item.sub_items.length > 0 && (
                        <ol className="toc-sub-list">
                          {item.sub_items.map((sub, i) => (
                            <li key={i} className="toc-sub-item">{sub}</li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Nội dung */}
              {content_sections.map((section, idx) => (
                <section key={idx} className="content-section">
                  <h2 className="section-title">{section.title}</h2>
                  {section.sub_sections?.map((sub, i) => (
                    <div key={i}>
                      {sub.subtitle && <h3 className="section-subtitle">{sub.subtitle}</h3>}
                      <p className="paragraph" dangerouslySetInnerHTML={{ __html: sub.content }} />
                    </div>
                  ))}
                  {section.images?.map((img, i) => (
                    <div key={i} className="content-image">
                      <img src={img.src} alt={img.alt} className="image" />
                      <p className="image-caption">{img.caption}</p>
                    </div>
                  ))}
                </section>
              ))}

              {/* Bài viết liên quan */}
              <section className="content-section">
                <h3 className="related-title">Bài viết liên quan:</h3>
                <ul className="related-list">
                  {related_posts.map((post, idx) => (
                    <li key={idx} className="list-item">
                      <a href={`/post-detail/${section}/${post.id}`} className="related-link">{post.title}</a>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tags */}
              <div className="article-footer">
                <div className="footer-section">
                  <span className="footer-label">Tags:</span>
                  <div className="tags-container">
                    {tags.map((tag, idx) => (
                      <a key={idx} href="#" className="tag">{tag}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogDetail; 