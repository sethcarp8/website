document.querySelector(".icon-menu").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Scroll Progress Indicator
document.addEventListener('scroll', () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    const docElement = document.documentElement;
    const scrollPercent = (docElement.scrollTop / (docElement.scrollHeight - docElement.clientHeight)) * 100;
    scrollProgress.style.setProperty('--scroll', `${scrollPercent}%`);
  }
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});

// Share Functionality
document.addEventListener('DOMContentLoaded', () => {
  const shareButtons = document.querySelectorAll('.share-button');
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = window.location.href;
      const platform = button.getAttribute('aria-label').toLowerCase();
      
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
      };
      
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
    });
  });
});

// Update the Swiper initialization in blog.html
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper only if we're on the blog page
  if (document.querySelector('.blog-swiper')) {
    const initSwiper = () => {
      return new Swiper('.blog-swiper', {
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: 30,
        loop: false,
        mousewheel: {
          sensitivity: 1,
          releaseOnEdges: true,
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        grabCursor: true,
        touchRatio: 1,
        allowTouchMove: true,
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }
      });
    };

    window.blogSwiper = initSwiper();

    // Search functionality
    const blogSearch = document.getElementById('blog-search');
    const searchButton = document.querySelector('.blog-search__button');
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    if (blogSearch && searchButton) {
      const performSearch = () => {
        const searchTerm = blogSearch.value.toLowerCase().trim();
        const slides = document.querySelectorAll('.swiper-slide');
        let hasResults = false;

        // Reset all slides visibility first
        slides.forEach(slide => {
          slide.style.display = '';
          slide.classList.remove('hidden');
        });

        if (searchTerm === '') {
          hasResults = true;
          if (window.blogSwiper) {
            window.blogSwiper.destroy();
            window.blogSwiper = initSwiper();
          }
        } else {
          slides.forEach(slide => {
            const article = slide.querySelector('.blog-item');
            if (article) {
              const title = article.querySelector('.blog-item__title').textContent.toLowerCase();
              const excerpt = article.querySelector('.blog-item__excerpt').textContent.toLowerCase();
              const category = article.querySelector('.blog-item__category').textContent.toLowerCase();
              
              const isVisible = title.includes(searchTerm) || 
                              excerpt.includes(searchTerm) || 
                              category.includes(searchTerm);
              
              if (!isVisible) {
                slide.classList.add('hidden');
              } else {
                hasResults = true;
              }
            }
          });

          // Reinitialize Swiper with filtered slides
          if (window.blogSwiper) {
            window.blogSwiper.destroy();
            
            // Remove hidden slides temporarily
            const hiddenSlides = document.querySelectorAll('.swiper-slide.hidden');
            hiddenSlides.forEach(slide => {
              slide.style.display = 'none';
            });

            window.blogSwiper = initSwiper();
          }
        }

        // Show/hide no results message
        let noResults = document.querySelector('.no-results');
        if (!hasResults) {
          if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No articles found matching your search.';
            blogSearch.parentElement.appendChild(noResults);
          }
          swiperWrapper.style.display = 'none';
        } else {
          if (noResults) {
            noResults.remove();
          }
          swiperWrapper.style.display = '';
        }
      };

      // Search on button click
      searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
      });

      // Search on Enter key
      blogSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch();
        }
      });

      // Search on input
      blogSearch.addEventListener('input', performSearch);

      // Clear search
      blogSearch.addEventListener('search', () => {
        if (blogSearch.value === '') {
          performSearch();
        }
      });
    }
  }
  
  // Initialize news page swipers
  if (document.querySelector('.company-news-swiper') || 
      document.querySelector('.local-news-swiper') || 
      document.querySelector('.county-news-swiper')) {
    
    const newsSwiperOptions = {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      grabCursor: true,
      touchRatio: 1,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    };

    // Initialize each news swiper
    const companySwiper = document.querySelector('.company-news-swiper') ? 
      new Swiper('.company-news-swiper', newsSwiperOptions) : null;
    const localSwiper = document.querySelector('.local-news-swiper') ? 
      new Swiper('.local-news-swiper', newsSwiperOptions) : null;
    const countySwiper = document.querySelector('.county-news-swiper') ? 
      new Swiper('.county-news-swiper', newsSwiperOptions) : null;
  }
});

// Category filtering
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-button');
  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter articles
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
          const article = slide.querySelector('.blog-item');
          if (article) {
            const articleCategory = article.querySelector('.blog-item__category').textContent.toLowerCase();
            const shouldShow = category === 'all' || articleCategory === category;
            slide.style.display = shouldShow ? 'block' : 'none';
          }
        });
        
        // Reinitialize swiper if needed
        if (window.blogSwiper) {
          window.blogSwiper.update();
        }
      });
    });
  }
});

// Newsletter form
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Here you would typically send this to your backend
      console.log('Newsletter signup:', email);
      
      // Show success message
      alert('Thank you for subscribing!');
      newsletterForm.reset();
    });
  }
});

// Back to top button
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.createElement('button');
  backToTop.classList.add('back-to-top');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
