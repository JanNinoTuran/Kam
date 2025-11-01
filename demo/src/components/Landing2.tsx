import { useEffect, type FC } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface LandingProps {
  onComplete: () => void
}

const doorVariants = {
  closed: { rotateY: 0 },
  // slowed down door open duration for a grander reveal
  openLeft: { rotateY: -90, transition: { duration: 2.4 } },
  openRight: { rotateY: 90, transition: { duration: 2.4 } },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  flash: { opacity: 1, transition: { duration: 0.9 } },
  out: { opacity: 0, transition: { duration: 1.2 } },
}

const Landing: FC<LandingProps> = ({ onComplete }) => {
  const controls = useAnimation()
  const leftControls = useAnimation()
  const rightControls = useAnimation()
  const titleControls = useAnimation()

  const titleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.0, delay: 0.12 } },
    exit: { opacity: 0, scale: 1.06, transition: { duration: 0.9 } },
  }

  useEffect(() => {
    const seq = async () => {
      // start doors and title so the title animates while doors open
      const leftPromise = leftControls.start('openLeft')
      const rightPromise = rightControls.start('openRight')
      // title is shorter and starts immediately with a tiny delay (see variant)
      titleControls.start('visible')

      // wait for doors to finish opening
      await Promise.all([leftPromise, rightPromise])

      // flash overlay and finish sequence
      await controls.start('flash')
      await new Promise((r) => setTimeout(r, 600))

      // fade title out as we finish
      await titleControls.start('exit')
      await controls.start('out')
      onComplete()
    }
    seq()
  }, [controls, onComplete, titleControls, leftControls, rightControls])

  return (
    <div className="landing-root fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="landing-stage relative w-full h-full flex items-center justify-center perspective">
        <motion.div
          className="landing-door left-door"
          initial={{ rotateY: 0 }}
          animate={leftControls}
          variants={{ openLeft: doorVariants.openLeft }}
        />
        <motion.div
          className="landing-door right-door"
          initial={{ rotateY: 0 }}
          animate={rightControls}
          variants={{ openRight: doorVariants.openRight }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={overlayVariants}
          className="landing-flash absolute inset-0 bg-white mix-blend-screen"
        />
        <div className="landing-title absolute z-40 text-center text-white">
          <motion.h1
            className="landing-welcome"
            initial="hidden"
            animate={titleControls}
            variants={titleVariants}
          >
            Welcome
          </motion.h1>
        </div>
      </div>
    </div>
  )
}

export default Landing
